"use client";

export default function DebugEnvPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
            <div className="space-y-2">
                <p>
                    <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl ? '✅ Set' : '❌ Not set'}
                </p>
                <p>
                    <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? '✅ Set' : '❌ Not set'}
                </p>
                {supabaseUrl && (
                    <p>
                        <strong>URL Preview:</strong> {supabaseUrl.substring(0, 30)}...
                    </p>
                )}
                {supabaseAnonKey && (
                    <p>
                        <strong>Key Preview:</strong> {supabaseAnonKey.substring(0, 30)}...
                    </p>
                )}
            </div>
        </div>
    );
}