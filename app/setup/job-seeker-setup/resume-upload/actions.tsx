"use server";

import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import { put } from "@vercel/blob";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the BasicResumeResult type
export type BasicResumeResult = {
  success: boolean;
  error?: string;
  data?: {
    cleanedResume: string;
    resumeSummary: string;
    topTenSkills: string[];
    lastTimeFullTimeEmployed: string | "current" | "never";
    yearsOfExperience: number;
    completedStepTwo: boolean;
    resumeUrl?: string;
  };
};

export async function ParsePDF(
  prevState: BasicResumeResult | null,
  formData: FormData
): Promise<BasicResumeResult> {
  const uploadedFiles = formData.getAll("FILE");
  let fileName = "";
  let parsedText = "";
  let resumeUrl = "";

  if (!uploadedFiles || uploadedFiles.length === 0) {
    console.log("No files found.");
    return {
      success: false,
      error: "No files found",
    };
  }

  const uploadedFile = uploadedFiles[0];
  console.log("Uploaded file:", uploadedFile);

  if (!(uploadedFile instanceof File)) {
    console.log("Uploaded file is not in the expected format.");
    return {
      success: false,
      error: "Uploaded file is not in the expected format",
    };
  }

  fileName = uuidv4();
  const tempFilePath = `/tmp/${fileName}.pdf`;

  try {
    // Convert file to buffer and write to temp location
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Upload to Vercel Blob Store
    const blob = await put(`resumes/${fileName}.pdf`, fileBuffer, {
      access: "public",
      contentType: "application/pdf",
    });
    resumeUrl = blob.url;

    // Parse PDF
    const pdfParser = new (PDFParser as any)(null, 1);

    await new Promise<void>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.log(errData.parserError);
        reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        parsedText = (pdfParser as any).getRawTextContent();
        resolve();
      });

      pdfParser.loadPDF(tempFilePath);
    });

    // Clean up the temp file
    await fs.unlink(tempFilePath).catch(console.error);

    // Initialize Google Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the prompt
    const prompt = `You are a resume parsing and analysis AI. Your task is to extract specific information from a provided resume text and format it as a JSON object.

Here's the JSON schema you must adhere to:
\`\`\`json
{
  "cleanedResume": "string",
  "resumeSummary": "string",
  "topTenSkills": ["string"],
  "lastTimeFullTimeEmployed": "string",
  "yearsOfExperience": "number"
}
\`\`\`

Here are the detailed instructions for each field:

- **cleanedResume**: Provide the entire resume text. CRITICAL: You must remove all mentions of the applicant's name and contact information (phone, email, address, LinkedIn, websites). The output for this field must be a valid JSON string, which means all special characters (like newlines or quotes) must be properly escaped (e.g., \\n for newlines).

- **resumeSummary**: Generate a concise summary of the applicant's professional profile, limited to 200 words. Do not include any name or contact information. Ensure this is a valid JSON string with proper escaping.

- **topTenSkills**: Identify the top 10 strongest skills. List them in descending order of strength. Each skill must be a string, no more than 5 words or 60 characters.

- **lastTimeFullTimeEmployed**: Determine the most recent full-time employment date.
  - If currently employed full-time, use "current".
  - If never full-time employed, use "never".
  - Otherwise, use YYYY-MM-DD format.

- **yearsOfExperience**: Calculate the total years of professional experience as a number. Round to the nearest whole number.

Resume to parse:
${parsedText}

Return ONLY the JSON object. Do not use markdown formatting. Ensure the entire output is a single, valid JSON object.`;

//print the text prompt being sent to Gemini
console.log(prompt)

    // Send to Gemini and get response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let resumeData;
    try {
      // Remove any potential markdown code blocks
      const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
      resumeData = JSON.parse(jsonString);
      //print the reply we're getting back.
      console.log(resumeData)
    } catch (parseError) {
       console.error("Failed to parse Gemini response:", parseError);
      // Log the problematic text to see what Gemini is returning
      console.error("Problematic Gemini response text:", text);
      return {
        success: false,
        error: "Failed to parse AI response. The response was not valid JSON.",
      };
    }

    // Return the structured data with completedStepTwo flag
    return {
      success: true,
      data: {
        cleanedResume: resumeData.cleanedResume,
        resumeSummary: resumeData.resumeSummary,
        topTenSkills: resumeData.topTenSkills,
        lastTimeFullTimeEmployed: resumeData.lastTimeFullTimeEmployed,
        yearsOfExperience: resumeData.yearsOfExperience,
        completedStepTwo: true,
        resumeUrl: resumeUrl,
      },
    };
  } catch (error) {
    // Clean up the temp file on error
    await fs.unlink(tempFilePath).catch(console.error);

    console.error("Error processing PDF:", error);
    return {
      success: false,
      error: "Failed to process PDF: " + (error as Error).message,
    };
  }
}