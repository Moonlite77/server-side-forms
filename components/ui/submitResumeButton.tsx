"use client"
import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";


export default function SubmitResume(){
  const { pending } = useFormStatus(); // Get the pending state of the form

  return (
    <button
      type="submit"
      className="mx-auto block px-6 py-3 bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-900 hover:ring-2 hover:ring-red-400 hover:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[250px]" // Added min-width for consistent size, flex for spinner alignment
      disabled={pending} // Disable button when pending
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        "Process Resume and Continue"
      )}
    </button>
  );
    
}