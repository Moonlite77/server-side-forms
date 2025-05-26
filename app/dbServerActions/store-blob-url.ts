"use server"
import { auth } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export default async function StoreBlobURL(blobUrl: string) {
  try {
    // Get userId
    const { userId } = await auth()

    if (!userId) {
      throw new Error("Unauthorized - no user ID found")
    }

    // Look in the users table where clerk_id = userId and update avatar_url
    const result = await sql`
      UPDATE users 
      SET avatar_url = ${blobUrl}
      WHERE clerk_id = ${userId}
      RETURNING id, avatar_url
    `

    if (result.length === 0) {
      throw new Error("User not found in database")
    }

    console.log("Avatar URL updated successfully for user:", userId)

    return {
      success: true,
      message: "Avatar URL stored successfully",
      avatarUrl: blobUrl,
    }
  } catch (e) {
    console.error("Neon blob url processing error:", e)
    // Something went wrong - no changes were made to database
    throw new Error("Failed to store blob URL in database")
  }
}
