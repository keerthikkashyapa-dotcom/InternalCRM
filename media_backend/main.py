import os
import httpx
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Optional, List

# Load environment variables from the root .env.local
load_dotenv(dotenv_path="../.env.local")

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"Error: Supabase credentials missing. URL: {SUPABASE_URL}, Key: {'Exists' if SUPABASE_KEY else 'Missing'}")

# Helper for Supabase Headers
def get_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }

@app.get("/")
async def root():
    return {"status": "online", "service": "CRM Media Backend"}

@app.post("/upload")
async def upload_file(
    workspace_id: str = Form(...),
    customer_id: Optional[str] = Form(None),
    deal_id: Optional[str] = Form(None),
    uploader_id: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        # 1. Read file content
        content = await file.read()
        
        # 2. Upload to Supabase Storage
        bucket_name = "crm-media"
        file_path = f"{workspace_id}/{file.filename}"
        
        async with httpx.AsyncClient() as client:
            # Upload the file to storage
            storage_url = f"{SUPABASE_URL}/storage/v1/object/{bucket_name}/{file_path}"
            upload_res = await client.post(
                storage_url,
                content=content,
                headers={
                    **get_headers(),
                    "Content-Type": file.content_type,
                    "x-upsert": "true"
                }
            )
            
            if upload_res.status_code != 200:
                print(f"Storage error: {upload_res.text}")
                raise HTTPException(status_code=upload_res.status_code, detail=f"Storage error: {upload_res.text}")

            # 3. Save metadata to media_attachments table via PostgREST
            metadata = {
                "workspace_id": workspace_id,
                "customer_id": customer_id if customer_id else None,
                "deal_id": deal_id if deal_id else None,
                "file_name": file.filename,
                "file_path": file_path,
                "file_type": file.content_type,
                "file_size": len(content),
                "uploader_id": uploader_id if uploader_id else None
            }
            
            db_url = f"{SUPABASE_URL}/rest/v1/media_attachments"
            db_res = await client.post(
                db_url,
                json=metadata,
                headers={
                    **get_headers(),
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
            )
            
            if db_res.status_code not in [200, 201]:
                print(f"DB error: {db_res.text}")
                raise HTTPException(status_code=db_res.status_code, detail=f"Database error: {db_res.text}")

            return {
                "success": True,
                "data": db_res.json()[0] if db_res.json() else None
            }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attachments/{workspace_id}")
async def list_attachments(workspace_id: str, customer_id: Optional[str] = None, deal_id: Optional[str] = None):
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        async with httpx.AsyncClient() as client:
            # Query the media_attachments table
            db_url = f"{SUPABASE_URL}/rest/v1/media_attachments"
            params = {
                "workspace_id": f"eq.{workspace_id}",
                "order": "created_at.desc"
            }
            if customer_id:
                params["customer_id"] = f"eq.{customer_id}"
            if deal_id:
                params["deal_id"] = f"eq.{deal_id}"
                
            db_res = await client.get(
                db_url,
                params=params,
                headers=get_headers()
            )
            
            if db_res.status_code != 200:
                raise HTTPException(status_code=db_res.status_code, detail=f"Database error: {db_res.text}")
                
            attachments = db_res.json()
            
            # Generate signed URLs for each attachment
            bucket_name = "crm-media"
            for att in attachments:
                try:
                    signed_url_endpoint = f"{SUPABASE_URL}/storage/v1/object/sign/{bucket_name}/{att['file_path']}"
                    # create_signed_url equivalent
                    signed_res = await client.post(
                        signed_url_endpoint,
                        json={"expiresIn": 3600},
                        headers={**get_headers(), "Content-Type": "application/json"}
                    )
                    if signed_res.status_code == 200:
                        # Storage returns {"signedURL": "..."} or sometimes with a prefix
                        data = signed_res.json()
                        # The storage API returns a relative path sometimes, need to prepend base url if it doesn't have it
                        # But actually sign endpoint returns the full URL usually.
                        # Wait, let's check what it actually returns.
                        att["url"] = f"{SUPABASE_URL}/storage/v1{data['signedURL']}" if data['signedURL'].startswith("/") else data['signedURL']
                    else:
                        att["url"] = None
                except Exception as e:
                    print(f"Sign error for {att['file_name']}: {e}")
                    att["url"] = None
                    
            return attachments
            
    except Exception as e:
        print(f"List error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/attachments/{attachment_id}")
async def delete_attachment(attachment_id: str):
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured")

        async with httpx.AsyncClient() as client:
            # 1. Get info
            db_url = f"{SUPABASE_URL}/rest/v1/media_attachments"
            get_res = await client.get(
                db_url,
                params={"id": f"eq.{attachment_id}", "select": "*"},
                headers={**get_headers(), "Accept": "application/vnd.pgrst.object+json"}
            )
            
            if get_res.status_code != 200:
                return {"success": False, "message": "Not found"}
                
            attachment = get_res.json()
            
            # 2. Delete from storage
            storage_url = f"{SUPABASE_URL}/storage/v1/object/crm-media"
            await client.request(
                "DELETE",
                storage_url,
                json={"prefixes": [attachment["file_path"]]},
                headers={**get_headers(), "Content-Type": "application/json"}
            )
            
            # 3. Delete from DB
            await client.delete(
                db_url,
                params={"id": f"eq.{attachment_id}"},
                headers=get_headers()
            )
            
            return {"success": True}
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

