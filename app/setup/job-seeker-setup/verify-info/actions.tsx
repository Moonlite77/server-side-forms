'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

type ResubmitResult = {
    success: boolean;
    error?: string;
    data?: {
        cleanedResume: string;
    };
}

export async function resubmitResume(
    prevState: ResubmitResult | null, 
    formData: FormData
): Promise<ResubmitResult> {
    try {
        // Get the resume data from formData
        // We'll need to pass this from the client
        const resumeData = formData.get('resumeData') as string;
        
        if (!resumeData) {
            return {
                success: false,
                error: "No resume data provided"
            };
        }

        let resumeInfo;
        try {
            resumeInfo = JSON.parse(resumeData);
        } catch (e) {
            return {
                success: false,
                error: "Invalid resume data format"
            };
        }

        // Get the original parsed text - you might want to store this in localStorage too
        // For now, we'll use the cleanedResume and ask Gemini to re-clean it more aggressively
        const textToClean = resumeInfo.cleanedResume || "";

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `You are a resume cleaning AI. Your task is to remove ALL personal identifying information from the resume text below.

CRITICAL REQUIREMENTS:
- Remove ALL names (first, middle, last) - even if they appear in job titles like "John's Restaurant"
- Remove ALL email addresses
- Remove ALL phone numbers (including any format variations)
- Remove ALL physical addresses (street, city, state, zip)
- Remove ALL LinkedIn profiles, personal websites, GitHub profiles, or any other personal URLs
- Remove any social media handles or usernames
- Remove any ID numbers, license numbers, or personal identifiers
- Replace removed information with appropriate placeholders: [NAME], [EMAIL], [PHONE], [ADDRESS], [LINKEDIN], [WEBSITE], etc.
- If you see placeholders already, ensure they are consistent and no personal info was missed
- Preserve all other content including work experience, education, skills, and achievements
- Maintain the original formatting and structure as much as possible

AGGRESSIVE CLEANING:
- Any email that could identify someone should be replaced with [EMAIL]
- Any website that includes a personal name should be replaced with [PERSONAL WEBSITE]
- References to personal projects with identifying names should be genericized
- Even indirect references that could identify someone should be removed

Here is the resume to clean:

${textToClean}

Return ONLY the cleaned resume text with placeholders. Do not include any additional commentary, markdown formatting, or explanation.`;

        // Send to Gemini and get response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text();

        // Validate that we got a response
        if (!cleanedText || cleanedText.trim().length === 0) {
            return {
                success: false,
                error: "Failed to clean resume text"
            };
        }

        // Additional validation to ensure no obvious PII remains
        const commonPIIPatterns = [
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
            /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
            /\b\d{5}(?:[-\s]\d{4})?\b/, // ZIP code
            /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/, // LinkedIn
            /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+/, // GitHub
        ];

        let hasRemainingPII = false;
        for (const pattern of commonPIIPatterns) {
            if (pattern.test(cleanedText)) {
                hasRemainingPII = true;
                console.warn("Potential PII still found in cleaned text");
                break;
            }
        }

        if (hasRemainingPII) {
            // Try one more aggressive pass
            const aggressivePrompt = `The following text still contains personal information. Please remove ALL emails, phone numbers, addresses, and personal URLs, replacing them with placeholders like [EMAIL], [PHONE], etc.:

${cleanedText}

Return ONLY the cleaned text.`;
            
            const secondResult = await model.generateContent(aggressivePrompt);
            const secondResponse = await secondResult.response;
            const finalCleanedText = secondResponse.text();
            
            return {
                success: true,
                data: {
                    cleanedResume: finalCleanedText.trim()
                }
            };
        }

        return {
            success: true,
            data: {
                cleanedResume: cleanedText.trim()
            }
        };

    } catch (error) {
        console.error("Error resubmitting resume:", error);
        return {
            success: false,
            error: "Failed to reprocess resume: " + (error as Error).message
        };
    }
}