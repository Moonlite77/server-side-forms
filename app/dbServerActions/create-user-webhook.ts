"use server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Function is called when a webhook is received
export default async function SyncUserCreation(
  clerkId: string,
  email: string,
  userType: "talent_seeker" | "job_seeker" = "job_seeker",
  metadata?: any,
) {
  try {
    console.log(`Creating user with type: ${userType}`)

    // Call the Neon database function to create user
    const result = await sql`
      SELECT create_user_from_clerk(
        ${clerkId}::VARCHAR(255),
        ${userType}::user_type,
        ${email}::VARCHAR(255),
        ${JSON.stringify(metadata)}::JSONB
      )
    `

    console.log("User created successfully:", result)
    return { success: true, data: result }
  } catch (e) {
    console.error("Error creating user:", e)
    throw new Error("Failed to sync user creation")
  }
}
