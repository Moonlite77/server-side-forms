"use client";
import React, { useState, useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FileUpload from "@/components/FileUploader";
import { ParsePDF, BasicResumeResult } from "./actions"; // Adjust path as needed

// Define the stored data type
type StoredResumeInfo = {
  cleanedResume: string;
  resumeSummary: string;
  topTenSkills: string[];
  lastTimeFullTimeEmployed: string | "current" | "never";
  yearsOfExperience: number;
  completedStepTwo: boolean;
  resumeUrl?: string;
};

// Submit button component that uses useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="hidden"
      aria-hidden="true"
    >
      Submit
    </button>
  );
}

function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showPreviousDataDialog, setShowPreviousDataDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Server action state
  const [result, formAction] = useActionState(ParsePDF, null);
  const [persistedData, setPersistedData] = useState<StoredResumeInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPushingNewRoute, setIsPushingNewRoute] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // On mount, read from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("resumeInfo");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as StoredResumeInfo;
        setPersistedData(parsedData);
        console.log("Loaded from localStorage:", parsedData);
        // Show dialog if data exists
        setShowPreviousDataDialog(true);
      } catch (error) {
        console.error("Error parsing stored data:", error);
        localStorage.removeItem("resumeInfo");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage then send user to next step
  useEffect(() => {
    if (result?.success && result.data) {
      localStorage.setItem("resumeInfo", JSON.stringify(result.data));
      setPersistedData(result.data);
      console.log("Success! Data saved:", result.data);
      setIsProcessing(false);
      router.push("/setup/job-seeker-setup/verify-info");
      setIsPushingNewRoute(true);
    }

    if (result && !result.success && result.error) {
      console.log("Error:", result.error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  }, [result, router, toast]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setOpen(false);
    setIsProcessing(true);
    
    toast({
      variant: "default",
      title: "Processing Resume",
      description: `${file.name} is being processed...`,
    });

    // Use the form ref to submit
    if (formRef.current) {
      // Create a new FormData from the form
      const formData = new FormData();
      formData.append("FILE", file);
      
      // Create a DataTransfer object to programmatically set the file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Get the file input and set its files
      const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
      }
      
      // Submit the form
      formRef.current.requestSubmit();
    }
  };

  const handlePreviousDataChoice = (useExisting: boolean) => {
    setShowPreviousDataDialog(false);
    if (useExisting) {
      // Navigate to next page with existing data
      router.push("/setup/job-seeker-setup/verify-info");
    }
    // If not using existing data, user will proceed to upload new resume
  };

  // Don't render until we've checked localStorage
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Previous Data Dialog */}
      <AlertDialog open={showPreviousDataDialog} onOpenChange={setShowPreviousDataDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Previous Resume Found</AlertDialogTitle>
            <AlertDialogDescription>
              We found a previous resume upload. Do you want to use it or upload a new one?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handlePreviousDataChoice(false)}>
              Upload New Resume
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handlePreviousDataChoice(true)}>
              Use Previous Resume
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden form for server action */}
      <form ref={formRef} action={formAction} className="hidden">
        <input type="file" name="FILE" accept=".pdf" />
        <SubmitButton />
      </form>

      {/* Upload Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button 
            className="bg-black hover:bg-gray-700 text-white text-lg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isProcessing || isPushingNewRoute}
          >
            Upload Resume
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded shadow-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Upload your resume
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              setParsedText={() => {}} // Not needed anymore
              maxSize={8 * 1024 * 1024} // 8 MB
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading indicator */}
      {(isProcessing || isPushingNewRoute) && (
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          <p className="mt-4 text-gray-600">
            {isProcessing ? "Processing your resume..." : "Redirecting..."}
          </p>
        </div>
      )}

      {/* Error display */}
      {result && !result.success && result.error && (
        <div className="mt-6 w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{result.error}</p>
        </div>
      )}

      {/* CSS for loader */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spinner 1.5s linear infinite;
        }
        
        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;