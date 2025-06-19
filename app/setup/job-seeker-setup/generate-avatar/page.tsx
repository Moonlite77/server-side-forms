"use client"
import { useState, useActionState, useEffect, startTransition } from 'react'
import { useRouter } from "next/navigation"
import LilRedSpinner from "@/components/ui/lilRedSpinner";
import generateAvatar from "./actions"

//useful types
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

type StoredResumeInfo = {
  cleanedResume: string;
  resumeSummary: string;
  topTenSkills: string[];
  lastTimeFullTimeEmployed: string | "current" | "never";
  yearsOfExperience: number;
  completedStepTwo: boolean;
  resumeUrl?: string;
};

type StoredPrefs = {
    location: string
    relocate: boolean
    usCitizen: boolean
    remoteOnly: boolean
    completedStepFour: boolean
}

type StoredAvailability = {
  timezone: string
  mondayStart: string
  mondayEnd: string
  tuesdayStart: string
  tuesdayEnd: string
  wednesdayStart: string
  wednesdayEnd: string
  thursdayStart: string
  thursdayEnd: string
  fridayStart: string
  fridayEnd: string
  saturdayStart: string
  saturdayEnd: string
  sundayStart: string
  sundayEnd: string
  availabilityNote: string
  completedStepFive?: boolean
}

type clearanceInfo = {
    clearanceLevel: string;
    clearanceStatus: string;
    ableAndWilling: string;
    completedStepSix?: boolean;
};


export default function GenerateAvatarPage(){

    //things we need to display to user
    const [alias, setAlias] = useState("")
    const [resSum, setResSum] = useState("")
    const [clearance, setClearance] = useState("")
    const [loaded, setLoaded] = useState(false)

    //All the gathered Data to send to server action - this info does not need to be displayed to user
    const [userBasicInfo, setUserBasicInfo] = useState<string | null>(null)
    const [userResumeInfo, setUserResumeInfo] = useState<string | null>(null)
    const [userWorkPrefs, setUserWorkPrefs] = useState<string | null>(null)
    const [userAvailability, setUserAvailability] = useState<string | null>(null)
    const [userClearanceInfo, setUserClearanceInfo] = useState<string | null>(null)
    const router = useRouter();

    //ActionState for button. MUST use useActionState.
    const [state, action, pending] = useActionState(generateAvatarPlease, false)

    //useEffect to send user to dashbaord if state is true
    useEffect(()=>{
        if(state){
            router.push('/dashboard');
        }
    })

    //useEffect to prepare the data to send to server (action)
    useEffect(()=>{
        const userBasicInfoRaw = localStorage.getItem("basicInfo")
        setUserBasicInfo(userBasicInfoRaw)
        const userResumeInfoRaw = localStorage.getItem("resumeInfo")
        setUserResumeInfo(userResumeInfoRaw)
        const userWorkPrefsRaw = localStorage.getItem("prefsInfo")
        setUserWorkPrefs(userWorkPrefsRaw)
        const userAvailabilityRaw = localStorage.getItem("availabilityInfo")
        setUserAvailability(userAvailabilityRaw)
        const userClearanceRaw = localStorage.getItem("clearanceInfo")
        setUserClearanceInfo(userClearanceRaw)
    })

    //useEffect for displayed info only
    useEffect(()=>{
        const storedBasicInfo = localStorage.getItem("basicInfo")
        const storedResumeInfo = localStorage.getItem("resumeInfo")
        const storedClearanceInfo = localStorage.getItem("clearanceInfo")
        if (storedBasicInfo){
            try{
                const userAlias = JSON.parse(storedBasicInfo).alias
                setAlias(userAlias)

            }catch(e){console.error('Error parsing stored Alias data:', Error);}
        }
        if (storedResumeInfo){
            try{
                const resInfo = JSON.parse(storedResumeInfo).resumeSummary
                setResSum(resInfo)

            }catch(e){console.error('Error parsing stored resume data:', Error);}
        }
        if(storedClearanceInfo){
            try{
                const userClearance = JSON.parse(storedClearanceInfo).clearanceLevel
                setClearance(userClearance)
            } catch(e){console.error('Error parsing stored clearance data:', Error);}
        }
        setLoaded(true)
    }, [])

    //seperating the function out for readability
    async function generateAvatarPlease(){
        const successResult = await generateAvatar(userBasicInfo, userResumeInfo, userWorkPrefs, userAvailability, userClearanceInfo)
        return successResult.success
    }

    //display a spinner while it's loading
    if(!loaded){
        return(<LilRedSpinner/>)
    }

    return(
        <div key={loaded ? 'with-data' : 'empty'}>
            <div> Alias: {alias}</div>
            <div> Resume Summary: {resSum}</div>
            <div> Clearance: {clearance}</div>
            <button type="submit" className="border p-4"
                onClick={() => {
                    startTransition(async () => {
                    await action();
                    });
                }}
            >{pending ? <LilRedSpinner /> : 'Generate Avatar'}</button>
        </div>
    )
}