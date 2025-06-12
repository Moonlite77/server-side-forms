"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export type prefsData = {
    success: boolean
    data?: {
        location: string
        relocate: boolean
        usCitizen: boolean
        remoteOnly: boolean
        completedStepFour: boolean
    }
    error?: string
}

export async function prefsAction(prev: prefsData | null, formData: FormData){
    try {
        // Extract form data
        const location = formData.get('location') as string;
        const relocate = formData.get('relocate') === 'true';
        const usCitizen = formData.get('usCitizen') === 'true';
        const remoteOnly = formData.get('remoteOnly') === 'true';

        // Validate location
        if (!location || location.trim() === '') {
            return {
                success: false,
                error: "Location is required"
            }
        }

        // Validate location format (basic check)
        if (location.trim().length < 3) {
            return {
                success: false,
                error: "Please enter a valid location"
            }
        }


        // Set completedStepFour to false
        const completedStepFour = true;

        // Return validated data
        return {
            success: true,
            data: {
                location: location.trim(),
                relocate,
                usCitizen,
                remoteOnly,
                completedStepFour
            }
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: "Failed to process validate data: " + (error as Error).message,
        }
    }
}

export const autoComplete = async (input: string) => {
    if (!input) return [];

    try {
        const response = await client.placeAutocomplete({
            params: {
                input,
                key: process.env.GOOGLE_API_KEY!,
            },
        });

        return response.data.predictions;
    } catch (error) {
        console.error(error);
        return [];
    }
};