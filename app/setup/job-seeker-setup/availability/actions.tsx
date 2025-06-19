'use server'
export type availData = {
    success: boolean
    data?: {
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
    error?: string
}

export default async function AvailabilityAction(prev: availData | null, formData: FormData): Promise<availData> {

    const timezone = formData.get('timezone') as string;
    const mondayStart = formData.get('mondayStart') as string;
    const mondayEnd = formData.get('mondayEnd') as string;
    const tuesdayStart = formData.get('tuesdayStart') as string;
    const tuesdayEnd = formData.get('tuesdayEnd') as string;
    const wednesdayStart = formData.get('wednesdayStart') as string;
    const wednesdayEnd = formData.get('wednesdayEnd') as string;
    const thursdayStart = formData.get('thursdayStart') as string;
    const thursdayEnd = formData.get('thursdayEnd') as string;
    const fridayStart = formData.get('fridayStart') as string;
    const fridayEnd = formData.get('fridayEnd') as string;
    const saturdayStart = formData.get('saturdayStart') as string;
    const saturdayEnd = formData.get('saturdayEnd') as string;
    const sundayStart = formData.get('sundayStart') as string;
    const sundayEnd = formData.get('sundayEnd') as string;
    const availabilityNote = formData.get('availabilityNote') as string;
    const completedStepFive = true; //We will set it to true and just not return it if something goes wrong.


    //verify data
    if (!timezone) {
    return {
        success: false,
        error: "Please fill in timezone"
        };
    }

    // Simulate processing time
    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    });

    console.log(
    `server action was triggered, sunday start is: ${sundayStart}`
    )

    return {
        success: true,  // <-- Added comma here
        data: {
            timezone,
            mondayStart,
            mondayEnd,
            tuesdayStart,
            tuesdayEnd,
            wednesdayStart,
            wednesdayEnd,
            thursdayStart,
            thursdayEnd,
            fridayStart,
            fridayEnd,
            saturdayStart,
            saturdayEnd,
            sundayStart,
            sundayEnd,
            availabilityNote,
            completedStepFive
        }
    };
    
}