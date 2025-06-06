"use client"
import { resubmitResume } from './actions'
import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

type ResumeInfo = {
    cleanedResume: string;
    resumeSummary: string;
    topTenSkills: string[];
    lastTimeFullTimeEmployed: string | "current" | "never";
    yearsOfExperience: number;
    completedStepTwo: boolean;
    resumeUrl?: string;
}

export default function VerifyInfoPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [resumeText, formAction, isPending] = useActionState(resubmitResume, null)
    const [cleanedResumeText, setCleanedResumeText] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [hasData, setHasData] = useState(false)
    const [fullResumeData, setFullResumeData] = useState<ResumeInfo | null>(null)

    useEffect(() => {
        // On mount, grab the data saved in localStorage
        const retrievedFromLocalStorage = localStorage.getItem("resumeInfo");
        
        if (retrievedFromLocalStorage) {
            try {
                const resumeData: ResumeInfo = JSON.parse(retrievedFromLocalStorage);
                if (resumeData.cleanedResume) {
                    setCleanedResumeText(resumeData.cleanedResume);
                    setFullResumeData(resumeData);
                    setHasData(true);
                } else {
                    setHasData(false);
                }
            } catch (error) {
                console.error("Error parsing resume data:", error);
                setHasData(false);
            }
        } else {
            setHasData(false);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Update cleanedResumeText when resumeText changes (after resubmission)
        if (resumeText && resumeText.success && resumeText.data?.cleanedResume) {
            setCleanedResumeText(resumeText.data.cleanedResume);
            // Update localStorage with new data
            const existingData = localStorage.getItem("resumeInfo");
            if (existingData) {
                try {
                    const resumeData = JSON.parse(existingData);
                    resumeData.cleanedResume = resumeText.data.cleanedResume;
                    localStorage.setItem("resumeInfo", JSON.stringify(resumeData));
                } catch (error) {
                    console.error("Error updating localStorage:", error);
                }
            }
            toast({
                variant: "default",
                title: "Resume Reprocessed",
                description: "Your resume has been cleaned again. Please verify the text below.",
            });
        }
    }, [resumeText, toast]);

    function continueNextStep() {
        // Send user to availability page
        router.push("/setup/job-seeker-setup/availability");
    }

    function handleResubmit(e: React.FormEvent) {
        e.preventDefault();
        toast({
            variant: "default",
            title: "Reprocessing Resume",
            description: "Cleaning your resume again...",
        });
        // The form will automatically call formAction
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">No Resume Found</h2>
                    <p className="text-gray-600 mb-6">
                        It looks like you haven't uploaded a resume yet. Please go back to the previous step and upload your resume.
                    </p>
                    <button
                        onClick={() => router.push("/setup/job-seeker-setup")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                        Go Back to Upload Resume
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Verify Your Information</h1>
                    <p className="text-gray-600 mb-6">
                        Please verify that your name or contact information is not in the text below 
                        (unless you prefer unsolicited contact from talent-seekers).
                    </p>
                    
                    <form onSubmit={handleResubmit} action={formAction}>
                        <input 
                            type="hidden" 
                            name="resumeData" 
                            value={fullResumeData ? JSON.stringify(fullResumeData) : ''} 
                        />
                        <div className="mb-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                                {isPending ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                                        <span className="ml-3 text-gray-600">Loading new resume...</span>
                                    </div>
                                ) : (
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                                        {cleanedResumeText}
                                    </pre>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <button 
                                type="submit" 
                                name="button" 
                                value="submit"
                                disabled={isPending}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Not Clean, Resubmit!
                            </button>
                            <button 
                                type="button"
                                onClick={continueNextStep}
                                disabled={isPending}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
                            >
                                Cleaned! Continue...
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
    )
}