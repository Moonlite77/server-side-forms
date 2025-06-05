"use server"

// Define the return type for better TypeScript support
export type BasicInfoResult = {
  success: boolean;
  error?: string;
  data?: {
    firstName: string;
    lastName: string;
    careerField: string;
    alias: string;
    fullTime: boolean;
    contract: boolean;
    speaker: boolean;
    stepOne: string;
  };
};

export async function basicInfoAction(prevState: BasicInfoResult | null, formData: FormData): Promise<BasicInfoResult> {
    // Extract form data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const careerField = formData.get('careerField') as string;
    const alias = formData.get('alias') as string;
    const fullTime = formData.get('fullTime') as string;
    const contract = formData.get('contract') as string;
    const speaker = formData.get('speaker') as string;
    const stepOne = formData.get('stepOne') as string;
    
    // Validate data
    if (!firstName || !lastName) {
        return {
            success: false,
            error: "Please fill in all fields"
        };
    }
    
    // Simulate processing time
    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
    
    console.log("printing careerField fullTime, contract, speaker, and stepOne (the hidden input)", careerField, fullTime, contract, speaker, stepOne)
    // Return structured data
    return {
        success: true,
        data: {
            firstName,
            lastName,
            careerField,
            alias,
            fullTime: fullTime === 'yes',  // Convert 'yes' to true, anything else to false
            contract: contract === 'yes',   // Convert 'yes' to true, anything else to false
            speaker: speaker === 'yes',     // Convert 'yes' to true, anything else to false
            stepOne
        }
    };
}