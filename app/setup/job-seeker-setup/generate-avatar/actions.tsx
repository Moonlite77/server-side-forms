"use server"

//all the things we'll be sending to server action
type userInfo = {
    firstName: string;
    lastName: string;
    careerField: string;
    alias: string;
    fullTime: boolean;
    contract: boolean;
    speaker: boolean;
    cleanedResume: string;
    resumeSummary: string;
    topTenSkills: string[];
    lastTimeFullTimeEmployed: string | "current" | "never";
    yearsOfExperience: number;
    resumeUrl?: string;
    location: string
    relocate: boolean
    usCitizen: boolean
    remoteOnly: boolean
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
    clearanceLevel: string;
    clearanceStatus: string;
    ableAndWilling: string;
}

type StoredBasicInfo = {
    firstName: string | null;
    lastName: string | null;
    careerField: string | null;
    alias: string | null;
    fullTime: boolean | null;
    contract: boolean | null;
    speaker: boolean | null;
    stepOne: string | null;
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

export default async function generateAvatar(
  userBasicInfo: string | null,
  userResumeInfo: string | null,
  userWorkPrefs: string | null,
  userAvailability: string | null,
  userClearanceInfo: string | null
) {
    console.log("generate avatar server function was hit. Beginning Avatar Generation Process!")

    if (!userBasicInfo || !userResumeInfo || !userWorkPrefs || !userAvailability || !userClearanceInfo) {
        return { success: false, error: "Missing required information" };
    }

    try {
        // Parsing what's been given to us
        const parsedBasicInfoData = JSON.parse(userBasicInfo) as StoredBasicInfo;
        const parsedResumeInfoData = JSON.parse(userResumeInfo) as StoredResumeInfo;
        const parsedPrefsInfoData = JSON.parse(userWorkPrefs) as StoredPrefs;
        const parsedAvailabilityInfoData = JSON.parse(userAvailability) as StoredAvailability;
        const parsedClearanceInfoData = JSON.parse(userClearanceInfo) as clearanceInfo;

        // Testing that we're getting the proper value
        console.log(parsedBasicInfoData.alias)

        return {
            success: true
        }
    } catch (error) {
        console.error("Error parsing data:", error)
        return {
            success: false,
            error: "Invalid data format"
        }
    }
}