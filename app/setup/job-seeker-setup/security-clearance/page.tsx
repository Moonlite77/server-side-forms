"use client"

import { useActionState, useState, useEffect } from "react";
import { clearanceAction } from "./actions";
import LilRedSpinner from "@/components/ui/lilRedSpinner";
import { useRouter } from 'next/navigation';

type clearanceInfo = {
    clearanceLevel: string;
    clearanceStatus: string;
    ableAndWilling: boolean;
    completedStepSix?: boolean;
};

const userClearanceLevel = [
    { value: "none", label: "None" },
    { value: "public-trust", label: "Public Trust" },
    { value: "secret", label: "Secret" },
    { value: "topSecret", label: "Top Secret" },
    { value: "topSecretSCI", label: "Top Secret SCI" },
    { value: "q-clearance", label: "Q clearance" },
]
const clearanceStatus = [
    { value: "expired", label: "expired" },
    { value: "active", label: "active" },
    { value: "non-jurisdiction", label: "non-jurisdiction" },
    { value: "non-jurisdiction-investigation", label: "Non-jurisdiction, need investigation" },
    { value: "non-jurisdiction-adjudication", label: "Non-jurisdiction, investigation complete, need adjudication" },
]

export default function SecurityClearancePage(){

    const [result, formAction, isPending] = useActionState(clearanceAction, null);
    const [persistedData, setPersistedData] = useState<clearanceInfo | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPushingNewRoute, setIsPushingNewRoute] = useState(false)
    const router = useRouter();

    // On mount, read from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("clearanceInfo");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData) as clearanceInfo;
                setPersistedData(parsedData);
                console.log('Loaded from localStorage:', parsedData);
            } catch (error) {
                console.error('Error parsing stored data:', error);
                localStorage.removeItem("clearanceInfo");
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when form is successfully submitted
    useEffect(() => {
        if (result?.success && result.data) {
            localStorage.setItem('clearanceInfo', JSON.stringify(result.data));
            setPersistedData(result.data);
            console.log('Success! Data saved:', result.data);
            router.push('/setup/job-seeker-setup/generate-avatar');
            setIsPushingNewRoute(true);
        }
        
        if (result?.error) {
            console.log('Error:', result.error);
        }
    }, [result]);

    if (isPushingNewRoute){
        return <LilRedSpinner />
    }
    
    // Don't render the form until we've loaded from localStorage
    if (!isLoaded) {
        return <LilRedSpinner />;
    }


    return(
        <div className="max-w-2xl mx-auto p-6 pt-8">
            <div className="text-center text-2xl font-bold mb-8 text-gray-800">Clearance Info</div>
            <form action={formAction} className="space-y-4" key={persistedData ? 'with-data' : 'empty'}>

                            {/* clearance level */}
                <div>
                    <div className="mb-1 text-black">Career Field</div>
                    <select
                        id="clearanceLevel"
                        name="clearanceLevel"
                        defaultValue={persistedData?.clearanceLevel || ""}
                        className="border border-neutral-950 w-full px-3 py-2 rounded bg-white"
                        required
                    >
                        <option value="">Select your cleearance level</option>
                        {userClearanceLevel.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </div>

                        {/* Clearance Status */}
                <div>
                    <div className="mb-1 text-black">Clearance Status</div>
                    <select
                        id="clearanceStatus"
                        name="clearanceStatus"
                        defaultValue={persistedData?.clearanceStatus || ""}
                        className="border border-neutral-950 w-full px-3 py-2 rounded bg-white"
                        required
                    >
                        <option value="">Select your career field</option>
                        {clearanceStatus.map((field) => (
                            <option key={field.value} value={field.value}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </div>

                            {/* Able and Willing */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="ableAndWilling"
                        name="ableAndWilling"
                        value="yes"
                        defaultChecked={persistedData?.ableAndWilling === true}
                        className="w-4 h-4 text-red-900 border-neutral-950 rounded focus:ring-red-900"
                    />
                    <label htmlFor="fullTime" className="text-black">
                        Are you willing and able to get cleared or upgrade your clearance?
                    </label>
                </div>

                        {/* Submit Button */}
                <div className="pt-6">
                <button
                    type="submit"
                    disabled={isPending || isPushingNewRoute}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending || isPushingNewRoute ? (
                    <>
                        <LilRedSpinner />
                        <span>Saving...</span>
                    </>
                    ) : (
                    <>
                        <span>Save and Continue</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </>
                    )}
                </button>
                </div>
            
            </form>
        </div>
    )
}