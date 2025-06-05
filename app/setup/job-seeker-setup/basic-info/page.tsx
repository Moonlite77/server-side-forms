"use client"

import { useActionState, useState, useEffect } from "react";
import { basicInfoAction, type BasicInfoResult } from "./actions";
import LilRedSpinner from "@/components/ui/lilRedSpinner";
import { IT_CAREER_FIELDS } from "@/app/setup/job-seeker-setup/jobSeekerComponents/itCareerFields"
import { useRouter } from 'next/navigation';

// Define the type for stored data
type StoredBasicInfo = {
    firstName: string;
    lastName: string;
    careerField: string;
    alias: string;
    fullTime: boolean;
    contract: boolean;
    speaker: boolean;
    stepOne: string;
};

export default function BasicInfoPage() {
    const [result, formAction, isPending] = useActionState(basicInfoAction, null);
    const [persistedData, setPersistedData] = useState<StoredBasicInfo | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPushingNewRoute, setIsPushingNewRoute] = useState(false)
    const router = useRouter();

    // On mount, read from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("basicInfo");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData) as StoredBasicInfo;
                setPersistedData(parsedData);
                console.log('Loaded from localStorage:', parsedData);
            } catch (error) {
                console.error('Error parsing stored data:', error);
                localStorage.removeItem("basicInfo");
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when form is successfully submitted
    useEffect(() => {
        if (result?.success && result.data) {
            localStorage.setItem('basicInfo', JSON.stringify(result.data));
            setPersistedData(result.data);
            console.log('Success! Data saved:', result.data);
            router.push('/setup/job-seeker-setup/resume-upload');
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
    
    return (
        <form action={formAction} className="space-y-4" key={persistedData ? 'with-data' : 'empty'}>
            <h2 className="text-xl font-semibold text-black mb-6">Basic Info</h2>

            {/* First Name */}
            <div>
                <div className="mb-1 text-black">First Name</div>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={persistedData?.firstName || ""}
                    className="border border-neutral-950 w-full px-3 py-2 rounded"
                    required
                />
            </div>

            {/* Last Name */}
            <div>
                <div className="mb-1 text-black">Last Name</div>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={persistedData?.lastName || ""}
                    className="border border-neutral-950 w-full px-3 py-2 rounded"
                    required
                />
            </div>

            {/* Alias */}
            <div>
                <div className="mb-1 text-black">Alias/Preferred Name</div>
                <input
                    type="text"
                    id="alias"
                    name="alias"
                    defaultValue={persistedData?.alias || ""}
                    className="border border-neutral-950 w-full px-3 py-2 rounded"
                    placeholder="Optional"
                />
            </div>

            {/* Career Field */}
            <div>
                <div className="mb-1 text-black">Career Field</div>
                <select
                    id="careerField"
                    name="careerField"
                    defaultValue={persistedData?.careerField || ""}
                    className="border border-neutral-950 w-full px-3 py-2 rounded bg-white"
                    required
                >
                    <option value="">Select your career field</option>
                    {IT_CAREER_FIELDS.map((field) => (
                        <option key={field.value} value={field.value}>
                            {field.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Work Preferences */}
            <div className="space-y-3">
                <div className="text-black font-medium">Work Preferences</div>

                {/* Full Time */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="fullTime"
                        name="fullTime"
                        value="yes"
                        defaultChecked={persistedData?.fullTime === true}
                        className="w-4 h-4 text-red-900 border-neutral-950 rounded focus:ring-red-900"
                    />
                    <label htmlFor="fullTime" className="text-black">
                        Open to full-time work
                    </label>
                </div>

                {/* Contract */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="contract"
                        name="contract"
                        value="yes"
                        defaultChecked={persistedData?.contract === true}
                        className="w-4 h-4 text-red-900 border-neutral-950 rounded focus:ring-red-900"
                    />
                    <label htmlFor="contract" className="text-black">
                        Open to contract work
                    </label>
                </div>

                {/* Speaker */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="speaker"
                        name="speaker"
                        value="yes"
                        defaultChecked={persistedData?.speaker === true}
                        className="w-4 h-4 text-red-900 border-neutral-950 rounded focus:ring-red-900"
                    />
                    <label htmlFor="speaker" className="text-black">
                        Open to speaking at events
                    </label>
                </div>
            </div>

            {/* Hidden field for stepper */}
            <input type="hidden" id="stepOne" name="stepOne" value="complete" />

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className={`px-4 py-2 rounded ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-red-900 hover:bg-red-800"} text-white transition-colors`}
                >
                    {isPending ? (
                        <span className="flex items-center">
                            <LilRedSpinner />
                        </span>
                    ) : (
                        persistedData ? "Update" : "Submit"
                    )}
                </button>
            </div>

            {/* Message */}
            {result?.error && (
                <div className="text-red-500">{result.error}</div>
            )}
            {result?.success && (
                <div className="text-green-500">
                    Successfully saved data for {result.data?.firstName} {result.data?.lastName}
                </div>
            )}
        </form>
    );
}