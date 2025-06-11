import Link from "next/link"
import Image from "next/image"
import { UserCircle } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function getUserAvatar(clerkId: string) {
  try {
    const result = await sql`
      SELECT avatar_url 
      FROM users 
      WHERE clerk_id = ${clerkId}
    `
    return result[0]?.avatar_url || null
  } catch (error) {
    console.error("Error fetching user avatar:", error)
    return null
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  let avatarUrl = null
  if (userId) {
    avatarUrl = await getUserAvatar(userId)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt="User Avatar"
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          ) : (
            <UserCircle className="w-32 h-32 text-muted-foreground" />
          )}
        </div>

        <div className="w-full max-w-xs">
          <Link href="/setup" className="w-full inline-block">
            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
              Setup
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
