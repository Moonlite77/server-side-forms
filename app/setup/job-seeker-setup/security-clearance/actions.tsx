"use server"

// Define the return type for better TypeScript support
export type clearanceResult = {
  success: boolean;
  error?: string;
  data?: {
    clearanceLevel: string;
    clearanceStatus: string;
    ableAndWilling: boolean;
    completedStepSix?: boolean;
  };
};

export async function clearanceAction(prevState: clearanceResult | null, formData: FormData): Promise<clearanceResult> {
    // Extract form data
    const clearanceLevel = formData.get('clearanceLevel') as string;
    const clearanceStatus = formData.get('clearanceStatus') as string;
    const ableAndWilling = formData.get('ableAndWilling') as string;
    const completedStepSix = true; //setting it true for right now, and we just wont return it if something goes wrong
    
    // Validate data
    if (!clearanceLevel) {
        return {
            success: false,
            error: "Please select your clearance type. If no clearance, select none."
        };
    }
    
    // Simulate processing time
    await new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
    
    // Return structured data
    return {
        success: true,
        data: {
            clearanceLevel,
            clearanceStatus,
            ableAndWilling: ableAndWilling === 'yes',  // Convert 'yes' to true, anything else to false
            completedStepSix
        }
    };
}