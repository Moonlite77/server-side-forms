"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Type for basic info data
interface BasicInfoData {
  fullName: string
  alias: string
  openToFullTime: boolean
  openToContract: boolean
  openToSpeaking: boolean
}

// Type for location and work preferences data
interface LocationAndWorkPreferencesData {
  country: string
  city: string
  workPreference: "remote" | "hybrid" | "onsite"
  willingToRelocate: boolean
  preferredLocations: string[]
}

// Type for security clearance data
interface SecurityClearanceData {
  hasClearance: boolean
  clearanceLevel: string
  clearanceStatus: "active" | "inactive" | "pending" | ""
  expirationDate: string
  willingToApply: boolean
}

// Type for parsed resume data from OpenAI
interface ParsedResumeData {
  summary: string;
  top_skills: (string | null)[];
  last_3_companies: (string | null)[];
  last_employment_date?: {
    month: string | null;
    year: string | null;
  };
  education: Array<{
    degree_type: string | null;
    major: string | null;
    school: string | null;
  }>;
  estimated_years_experience: number | null;
}


// Define the same ResumeData interface we're using elsewhere
interface ResumeData {
  resumeUrl: string;
  skills: string[];
  companies: Array<{
    name: string;
    position: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  summary: string;
  cleanedResume: string;
  yearsOfExperience: number;
}

// Type for avatar data
interface AvatarData {
  imageUrl: string
  prompt: string
  generatedAt: string
}

// Type for avatar generation input
interface AvatarGenerationInput {
  summary: string
  yearsOfExperience: number
  skills: string[]
  alias: string
}

// Save basic info
export async function saveBasicInfo(formData: FormData) {
  // Extract form data
  const fullName = formData.get("fullName") as string
  const alias = formData.get("alias") as string
  const openToFullTime = formData.has("openToFullTime")
  const openToContract = formData.has("openToContract")
  const openToSpeaking = formData.has("openToSpeaking")

  // Create data object
  const data: BasicInfoData = {
    fullName,
    alias,
    openToFullTime,
    openToContract,
    openToSpeaking,
  }

  // Store cookies() result in a variable
  const cookieStore = await cookies()

  // Save to cookies for now (in production, you'd save to a database)
  cookieStore.set("jobSeekerBasicInfo", JSON.stringify(data), {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
  })

  // Redirect to next step
  redirect("/setup-job-seeker?step=2")
}

// Process and save resume

export async function processResume(formData: FormData) {
  console.log("Starting resume processing...")

  try {
    // Get the uploaded file
    const file = formData.get("resumeFile") as File

    if (!file) {
      console.log("No file uploaded")
      throw new Error("No file uploaded")
    }

    console.log("File received:", file.name, "Size:", file.size, "Type:", file.type)

    // Read the file as text
    const resumeText = await file.text()
    console.log("Resume text length:", resumeText.length)
    console.log("First 100 chars of resume:", resumeText.substring(0, 100))

    // Create the prompt for OpenAI
    const prompt = `
You are an AI assistant that processes resumes. You will be given a resume in plain text format. Your task is to extract and return the following information in the exact JSON format below. Be consistent and never include any contact information such as phone numbers, email addresses, or home addresses.

Always return exactly the number of items requested. If any value is missing or unknown, return \`null\` in its place to maintain structure.

Return the result in the following JSON format:
{
  "summary": "[A professional summary of the resume in under 1000 words, including degrees, employment history, all technologies, all skills, and all certifications, with all contact information and references to thier name removed]",
  "top_skills": ["Skill1", "Skill2", ..., "Skill10"], // Fill with nulls if less than 10
  "last_3_companies": ["Company1", "Company2", "Company3"], // Use null for any missing company
  "last_employment_date": {
    "month": "MM", // Use 2-digit month if known, else null
    "year": "YYYY" // Use 4-digit year if known, else null
  },
  "education": [
    {
      "degree_type": "Undergraduate" | "Masters" | "PhD" | null,
      "major": "Major or Field of Study" | null,
      "school": "University or College Name" | null
    },
    ...
  ], // List up to 4 entries, only for Undergraduate, Masters, or PhD. Fill with nulls if fewer than 4.
  "estimated_years_experience": 5 // Estimate the total years of professional experience based on the resume
}

Now, here is the resume:
${resumeText}
`

    console.log("Calling OpenAI API...")

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key is missing")
      throw new Error("OpenAI API key is missing")
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that processes resumes and extracts structured information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    })

    console.log("OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.log("OpenAI API error:", JSON.stringify(errorData))
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log("OpenAI API result received")

    const content = result.choices[0].message.content
    console.log("OpenAI content:", content.substring(0, 100) + "...")

    // Parse the JSON response
    console.log("Parsing JSON response...")
    const parsedData = JSON.parse(content) as ParsedResumeData
    console.log("Parsed data:", JSON.stringify(parsedData).substring(0, 100) + "...")

    // Transform the parsed data to match our ResumeData interface
    console.log("Transforming data...")

    console.log("Education array:", JSON.stringify(parsedData.education))
    console.log("Estimated years of experience:", parsedData.estimated_years_experience)

    const resumeData: ResumeData = {
      resumeUrl: typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(file) : "/placeholder-resume-url",
      skills: (parsedData.top_skills || []).filter((skill) => skill !== null && skill !== undefined) as string[],
      companies: (parsedData.last_3_companies || [])
        .filter((company) => company !== null && company !== undefined)
        .map((company) => ({ name: company as string, position: "Not specified" })),
      education: parsedData.education
        .filter((edu) => edu && typeof edu === "object") // First filter out any null/undefined items
        .filter((edu) => edu.school !== null && edu.school !== undefined)
        .map((edu) => ({
          institution: edu.school as string,
          degree: `${edu.degree_type || ""} ${edu.major || ""}`.trim(),
          year: parsedData.last_employment_date?.year || "Not specified",
        })),
      summary: parsedData.summary,
      cleanedResume: resumeText,
      yearsOfExperience: parsedData.estimated_years_experience || 0,
    }

    console.log("Transformed data:", JSON.stringify(resumeData).substring(0, 100) + "...")

    // Store cookies() result in a variable
    const cookieStore = await cookies()

    // Save to cookies for now
    console.log("Saving to cookies...")
    console.log("About to save resume data to cookie:", JSON.stringify(resumeData).substring(0, 100) + "...")
    cookieStore.set("jobSeekerResumeData", JSON.stringify(resumeData), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: false, // Make it accessible to JavaScript
    })
    console.log("Resume data cookie set successfully")

    console.log("Successfully processed resume, redirecting...")

    // Redirect to next step - this will throw a NEXT_REDIRECT "error" which is normal
    redirect("/setup-job-seeker?step=3")
  } catch (error: any) {
    // Check if this is a redirect "error" which is actually expected
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("This is a redirect, not an actual error")
      throw error // Re-throw the redirect to let Next.js handle it
    }

    console.error("Error processing resume:", error)

    // Create a placeholder object in case of error
    const placeholderData: ResumeData = {
      resumeUrl: "/placeholder-resume-url",
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "UI/UX Design"],
      companies: [
        { name: "Example Corp", position: "Senior Developer" },
        { name: "Tech Solutions", position: "Frontend Engineer" },
      ],
      education: [{ institution: "University of Technology", degree: "BS Computer Science", year: "2018" }],
      summary: "Error processing resume. Placeholder data shown.",
      cleanedResume: "Error processing resume. Placeholder data shown.",
      yearsOfExperience: 3, // Default placeholder value
    }

    // Store cookies() result in a variable
    const cookieStore = await cookies()

    // Save to cookies for now - use the same httpOnly value as the success case
    cookieStore.set("jobSeekerResumeData", JSON.stringify(placeholderData), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: false, // Make it accessible to JavaScript, same as in success case
    })

    // Redirect to next step
    redirect("/setup-job-seeker?step=3")
  }
}

// New function to save edited resume data
export async function saveVerifiedData(formData: FormData) {
  console.log("saveVerifiedData action started...")
  
  try {
    // Get the existing data from cookies to preserve fields that aren't in the form
    const cookieStore = await cookies()
    const existingDataCookie = cookieStore.get("jobSeekerResumeData")
    
    let existingData: ResumeData = {
      resumeUrl: "/placeholder-resume-url",
      skills: [],
      companies: [],
      education: [],
      summary: "",
      cleanedResume: "",
      yearsOfExperience: 0
    }
    
    if (existingDataCookie?.value) {
      try {
        existingData = JSON.parse(existingDataCookie.value)
        console.log("Existing data retrieved from cookie:", 
          JSON.stringify(existingData).substring(0, 100) + "...")
      } catch (e) {
        console.error("Error parsing existing cookie data:", e)
      }
    }
    
    // Extract summary and years of experience
    const summary = formData.get("summary") as string || existingData.summary
    const yearsOfExperience = parseFloat(formData.get("yearsOfExperience") as string) || 
      existingData.yearsOfExperience
    
    // Process skills - extract all fields starting with "skill-"
    const skills: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("skill-") && value && typeof value === "string" && value.trim()) {
        console.log(`Adding skill from ${key}:`, value)
        skills.push(value.trim())
      }
    }
    console.log("Processed skills:", skills)
    
    // Process companies
    const companies: Array<{ name: string; position: string }> = []
    const companyEntries = new Map<number, { name?: string; position?: string }>()
    
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue
      
      if (key.startsWith("company-")) {
        const index = parseInt(key.split("-")[1])
        if (!companyEntries.has(index)) {
          companyEntries.set(index, {})
        }
        companyEntries.get(index)!.name = value.trim()
      } else if (key.startsWith("position-")) {
        const index = parseInt(key.split("-")[1])
        if (!companyEntries.has(index)) {
          companyEntries.set(index, {})
        }
        companyEntries.get(index)!.position = value.trim()
      }
    }
    
    // Convert map to array, ensuring both name and position are present
    for (const [_, company] of companyEntries) {
      if (company.name && company.name.trim()) {
        companies.push({
          name: company.name,
          position: company.position || "Not specified"
        })
      }
    }
    console.log("Processed companies:", companies)
    
    // Process education
    const education: Array<{ institution: string; degree: string; year: string }> = []
    const educationEntries = new Map<number, { institution?: string; degree?: string; year?: string }>()
    
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue
      
      if (key.startsWith("institution-")) {
        const index = parseInt(key.split("-")[1])
        if (!educationEntries.has(index)) {
          educationEntries.set(index, {})
        }
        educationEntries.get(index)!.institution = value.trim()
      } else if (key.startsWith("degree-")) {
        const index = parseInt(key.split("-")[1])
        if (!educationEntries.has(index)) {
          educationEntries.set(index, {})
        }
        educationEntries.get(index)!.degree = value.trim()
      } else if (key.startsWith("year-")) {
        const index = parseInt(key.split("-")[1])
        if (!educationEntries.has(index)) {
          educationEntries.set(index, {})
        }
        educationEntries.get(index)!.year = value.trim()
      }
    }
    
    // Convert map to array, ensuring institution is present
    for (const [_, edu] of educationEntries) {
      if (edu.institution && edu.institution.trim()) {
        education.push({
          institution: edu.institution,
          degree: edu.degree || "Not specified",
          year: edu.year || "Not specified"
        })
      }
    }
    console.log("Processed education:", education)
    
    // Create the updated resume data
    const updatedResumeData: ResumeData = {
      ...existingData,
      summary,
      yearsOfExperience,
      skills: skills.length > 0 ? skills : existingData.skills,
      companies: companies.length > 0 ? companies : existingData.companies,
      education: education.length > 0 ? education : existingData.education
    }
    
    console.log("Updated resume data:", JSON.stringify(updatedResumeData).substring(0, 100) + "...")
    
    // Save to cookies
    cookieStore.set("jobSeekerResumeData", JSON.stringify(updatedResumeData), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: false,  // Make it accessible to JavaScript
    })
    
    console.log("Resume data saved to cookie successfully")
    
    // Redirect to the next step
    redirect("/setup-job-seeker?step=4")
    
  } catch (error: any) {
    // Check if this is a redirect "error" which is actually expected
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("This is a redirect, not an actual error")
      throw error // Re-throw the redirect to let Next.js handle it
    }
    
    console.error("Error in saveVerifiedData:", error)
    throw new Error(`Failed to save verified resume data: ${error.message}`)
  }
}

// Save location and work preferences
export async function saveLocationAndWorkPreferences(formData: FormData) {
  console.log("Starting to save location and work preferences...")

  try {
    // Extract form data
    const country = formData.get("country") as string
    const city = formData.get("city") as string
    const workPreference = formData.get("workPreference") as "remote" | "hybrid" | "onsite"
    const willingToRelocate = formData.has("willingToRelocate")

    // Handle preferred locations (comma-separated string to array)
    const preferredLocationsString = formData.get("preferredLocations") as string
    const preferredLocations = preferredLocationsString
      ? preferredLocationsString
          .split(",")
          .map((location) => location.trim())
          .filter(Boolean)
      : []

    // Create data object
    const data: LocationAndWorkPreferencesData = {
      country,
      city,
      workPreference,
      willingToRelocate,
      preferredLocations,
    }

    console.log("Saving location and work preferences:", data)

    // Store cookies() result in a variable
    const cookieStore = await cookies()

    // Save to cookies for now
    cookieStore.set("jobSeekerLocationPrefs", JSON.stringify(data), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
    })

    console.log("Successfully saved location and work preferences, redirecting...")

    // Redirect to next step
    redirect("/setup-job-seeker?step=5")
  } catch (error: any) {
    // Check if this is a redirect "error" which is actually expected
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("This is a redirect, not an actual error")
      throw error // Re-throw the redirect to let Next.js handle it
    }

    console.error("Error saving location and work preferences:", error)
    // Redirect to the same step to try again
    redirect("/setup-job-seeker?step=4")
  }
}

// Save security clearance information
export async function saveSecurityClearance(formData: FormData) {
  console.log("Starting to save security clearance information...")

  try {
    // Extract form data
    const hasClearance = formData.get("hasClearance") === "yes"
    const clearanceLevel = formData.get("clearanceLevel") as string
    const clearanceStatus = formData.get("clearanceStatus") as "active" | "inactive" | "pending" | ""
    const expirationDate = formData.get("expirationDate") as string
    const willingToApply = formData.has("willingToApply")

    // Create data object
    const data: SecurityClearanceData = {
      hasClearance,
      clearanceLevel,
      clearanceStatus,
      expirationDate,
      willingToApply,
    }

    console.log("Saving security clearance information:", data)

    // Store cookies() result in a variable
    const cookieStore = await cookies()

    // Save to cookies for now
    cookieStore.set("jobSeekerClearance", JSON.stringify(data), {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
    })

    console.log("Successfully saved security clearance information, redirecting...")

    // Redirect to next step
    redirect("/setup-job-seeker?step=6")
  } catch (error: any) {
    // Check if this is a redirect "error" which is actually expected
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("This is a redirect, not an actual error")
      throw error // Re-throw the redirect to let Next.js handle it
    }

    console.error("Error saving security clearance information:", error)
    // Redirect to the same step to try again
    redirect("/setup-job-seeker?step=5")
  }
}

// Generate avatar - properly marked as a server action
export async function generateAvatar(
  input: AvatarGenerationInput,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {

  console.log("Starting avatar generation...")

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key is missing")
      return { success: false, error: "OpenAI API key is missing" }
    }

    // Create the prompt based on years of experience
    const mainStringArray: string[] = []
    const yoe = Number(input.yearsOfExperience)

    // Determine age/maturity level based on years of experience
    if (yoe < 3) {
      mainStringArray.push("a baby")
    } else if (yoe < 6) {
      mainStringArray.push("a teenager")
    } else if (yoe < 8) {
      mainStringArray.push("a young adult")
    } else if (yoe < 11) {
      mainStringArray.push("an adult")
    } else if (yoe < 16) {
      mainStringArray.push("an older adult")
    } else {
      mainStringArray.push("an ancient wizard")
    }

    // Extract top skills (up to 3)
    const topSkills = input.skills.slice(0, 3).join(", ")

    // Create the prompt for DALL-E
    const prompt = `Create a professional avatar for ${input.alias} who is ${mainStringArray.join(
      " ",
    )} animated animal character. The avatar should reflect their professional background: ${input.summary.substring(
      0,
      200,
    )}... Their top skills include ${topSkills}. The avatar should be friendly, professional, and suitable for a business profile. The image should be a close-up portrait with a simple, clean background. Make it an animated animal character with professional attire.`

    console.log("DALL-E prompt:", prompt)

    // Call DALL-E API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    })

    console.log("DALL-E API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.log("DALL-E API error:", JSON.stringify(errorData))
      return { success: false, error: `DALL-E API error: ${JSON.stringify(errorData)}` }
    }

    const result = await response.json()
    console.log("DALL-E API result received")

    // Extract the image URL
    const imageUrl = result.data[0]?.url
    if (!imageUrl) {
      return { success: false, error: "No image URL in the response" }
    }

    // Store the avatar data
    const avatarData: AvatarData = {
      imageUrl,
      prompt,
      generatedAt: new Date().toISOString(),
    }

    // Store cookies() result in a variable - make sure to await it
    const cookieStore = await cookies()

    // Save to cookies for now
    cookieStore.set("jobSeekerAvatar", JSON.stringify(avatarData), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
    })

    console.log("Successfully generated avatar")

    return { success: true, imageUrl }
  } catch (error: any) {
    console.error("Error generating avatar:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Helper function to get saved data
export async function getJobSeekerData() {
  // Store cookies() result in a variable
  const cookieStore = await cookies()

  // Then use that variable to access cookie methods
  const basicInfoCookie = cookieStore.get("jobSeekerBasicInfo")
  const resumeDataCookie = cookieStore.get("jobSeekerResumeData")
  const locationPrefsCookie = cookieStore.get("jobSeekerLocationPrefs")
  const clearanceCookie = cookieStore.get("jobSeekerClearance")
  const avatarCookie = cookieStore.get("jobSeekerAvatar")

  const basicInfo = basicInfoCookie ? JSON.parse(basicInfoCookie.value) : null
  const resumeData = resumeDataCookie ? JSON.parse(resumeDataCookie.value) : null
  const locationPrefs = locationPrefsCookie ? JSON.parse(locationPrefsCookie.value) : null
  const clearance = clearanceCookie ? JSON.parse(clearanceCookie.value) : null
  const avatar = avatarCookie ? JSON.parse(avatarCookie.value) : null

  return {
    basicInfo,
    resumeData,
    locationPrefs,
    clearance,
    avatar,
  }
}

export async function saveResume(formData: FormData) {
  console.log("Starting resume saving (placeholder)...")

  try {
    // Simulate saving the resume (replace with actual logic)
    const file = formData.get("resumeFile") as File

    if (!file) {
      throw new Error("No file uploaded")
    }

    console.log(`File received: ${file.name} (${file.size} bytes)`)

    // Redirect to next step
    redirect("/setup-job-seeker?step=3")
  } catch (error: any) {
    // Check if this is a redirect "error" which is actually expected
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      console.log("This is a redirect, not an actual error")
      throw error // Re-throw the redirect to let Next.js handle it
    }

    console.error("Error saving resume (placeholder):", error)
    // Redirect to the same step to try again
    redirect("/setup-job-seeker?step=2")
  }
}
export async function regenerateAvatar() {
  'use server'
  redirect("/setup-job-seeker?step=6")
}

/**
 * Server action to navigate back to resume upload
 */
export async function goToResumeUpload() {
  'use server'
  redirect("/setup-job-seeker?step=2")
}
