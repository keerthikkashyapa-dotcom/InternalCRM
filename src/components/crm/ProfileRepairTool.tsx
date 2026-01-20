"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { repairUserProfile } from "@/app/crm/repair-profile-action";

interface ProfileRepairToolProps {
  onSuccess?: () => void;
}

export function ProfileRepairTool({ onSuccess }: ProfileRepairToolProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean, error?: string, message?: string} | null>(null);

  const handleRepair = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await repairUserProfile();
      setResult(response);
      
      // If successful, call onSuccess callback
      if (response.success && onSuccess) {
        setTimeout(onSuccess, 1500); // Close after 1.5 seconds to show success message
      }
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 glass rounded-2xl border border-primary/10">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Profile Repair Tool</h2>
        <p className="text-sm text-[#0F172A]/60">
          Fix profile and workspace connection issues
        </p>
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-xl ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-start space-x-3">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${
                result.success ? 'text-green-800' : 'text-orange-800'
              }`}>
                {result.success ? 'Success!' : 'Error'}
              </p>
              <p className={`text-sm ${
                result.success ? 'text-green-700' : 'text-orange-700'
              }`}>
                {result.message || result.error}
              </p>
            </div>
          </div>
        </div>
      )}

      <motion.button
        onClick={handleRepair}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-[#0F172A] text-white font-bold rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Repairing...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-5 h-5" />
            <span>Repair Profile</span>
          </>
        )}
      </motion.button>

      <p className="mt-4 text-xs text-[#0F172A]/50 text-center">
        This will create or fix your profile and workspace connection
      </p>
    </div>
  );
}