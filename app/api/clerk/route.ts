import type { WebhookEvent } from "@clerk/nextjs/server"
import SyncUserCreation from "@/app/dbServerActions/create-user-webhook"

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json()
    console.log("Webhook payload:", payload)

    // Process the event based on type
    if (payload.type === "user.created") {
      const userData = payload.data

      // Extract required data from the webhook payload
      const clerkId = userData.id
      const email = userData.email_addresses?.[0]?.email_address

      // Determine user type (you can customize this logic)
      const userType = (userData.public_metadata?.user_type as "admin" | "user") || "user"

      // Prepare metadata
      const metadata = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        image_url: userData.image_url,
        created_at: userData.created_at,
        public_metadata: userData.public_metadata,
        private_metadata: userData.private_metadata,
      }

      if (!clerkId || !email) {
        console.error("Missing required user data:", { clerkId, email })
        return Response.json({ error: "Missing required user data" }, { status: 400 })
      }

      // Call the sync function
      await SyncUserCreation(clerkId, email, userType, metadata)

      console.log("User synced successfully:", clerkId)
    }

    // Everything went well
    return Response.json({ message: "Received" })
  } catch (e) {
    console.error("Webhook processing error:", e)
    // Something went wrong - no changes were made to the database
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
