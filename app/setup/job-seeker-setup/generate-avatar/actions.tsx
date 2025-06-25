"use server"

import OpenAI from "openai";
import { writeFile } from "fs/promises";
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { auth, currentUser } from '@clerk/nextjs/server'

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
  userClearanceInfo: string | null,
) {
    console.log("generate avatar server function was hit. Beginning Avatar Generation Process!")

    //Getting user
    const { userId } = await auth()

    //if null, user is not signed in
    if (!userId) {
        throw new Error('User not signed in.');
    }


    //creating openai client
    const client = new OpenAI();

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

        // Declare the variable that will hold the resulting stage.
        let characterDevelopementStage = "";

        // The switch statement evaluates each case.
        // It checks which boolean condition is the first to be true and executes that block.
        switch (true) {
            case parsedResumeInfoData.yearsOfExperience <= 3:
                characterDevelopementStage = "child";
                break; // Exits the switch statement

            case parsedResumeInfoData.yearsOfExperience < 10:
                characterDevelopementStage = "teenager";
                break; // Exits the switch statement

            case parsedResumeInfoData.yearsOfExperience < 15:
                characterDevelopementStage = "adult";
                break; // Exits the switch statement

            // The 'default' case runs if none of the above cases are true.
            default:
                characterDevelopementStage = "wise-elder";
                break; // Exits the switch statement
            }

        let characterWeapon = ""

        switch (parsedClearanceInfoData.clearanceLevel) {
            case "none":
                characterWeapon = "their martial arts skill";
                break; // Exits the switch statement

            case "public-trust":
                characterWeapon = "shuriken/throwing star";
                break; // Exits the switch statement

            case "secret":
                characterWeapon = "a sword";
                break; // Exits the switch statement

            case "topSecret":
                characterWeapon = "a Kusarigama (A sickle (kama) attached to a chain and weight)";
                break; // Exits the switch statement

            case "topSecretSCI":
                characterWeapon = "dual-wielded pistols";
                break; // Exits the switch statement

            case "q-clearance":
                characterWeapon = "a multi-purpose dagger";
                break; // Exits the switch statement

            // The 'default' case runs if the clearanceLevel doesn't match any of the cases.
            default:
                characterWeapon = "an unknown weapon";
                break;
        }

        //Construct prompt to send to Dall-e 3
        const dallePrompt = `Please create an image of a Dark Surrealism anime style character, who is a/an ${characterDevelopementStage}. This character exists in a mythological world and has to fight demons with ${characterWeapon}. Show them in Action.`
        
        //print the prompt we're trying send
        console.log(dallePrompt)

        //create an image creation request using the prompt
        const img = await client.images.generate({
            model: "gpt-image-1",
            prompt: dallePrompt,
            n: 1,
            size: "1024x1024"
            });

        //make sure img is not empty and put it in a buffer

        if (!img.data || img.data.length === 0) {
            throw new Error('No image data received');
            }
        const imageBuffer = Buffer.from(img.data?.[0]?.b64_json ?? '', "base64");

        //create a file name for the blob
        const blobName = `generated-image-${Date.now()}.png`;

        const blob = await put("avatars/", imageBuffer, {
            access: 'public',
            contentType: 'image/png'
        });

        //print on the server when we get the blob URL
        console.log(blob.url)

        //create the Neon instance
        const sql = neon(process.env.DATABASE_URL!)

        //throw it in neon
        try {
            const result = await sql`
                UPDATE users 
                SET avatar_url = ${blob.url} 
                WHERE clerk_id = ${userId} 
                RETURNING *
            `;
            
            if (result.length === 0) {
                throw new Error(`User with ID ${userId} not found`);
            }
        
        return result[0];

        } catch (error) {
            console.error('Error updating avatar URL:', error);
            throw error;
        }

    } catch (error) {
        console.error("Error parsing data:", error)
        return {
            success: false,
            error: "Invalid data format"
        }
    }
}