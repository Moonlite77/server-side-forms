"use client"

import { useState, useEffect } from "react"
import { generateAvatar, getJobSeekerData } from "@/app/actions"
import { RefreshCw, Download } from "lucide-react"
import { ServerButton } from "@/components/ui/button"

interface GenerateAvatarProps {
  resumeData?: {
    summary: string
    yearsOfExperience: number
    skills: string[]
  }
  basicInfo?: {
    alias?: string
  }
}

interface AvatarData {
  imageUrl: string
}

export default function GenerateAvatar({ resumeData, basicInfo }: GenerateAvatarProps) {
  const [avatar, setAvatar] = useState<AvatarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // Fetch initial avatar data
  useEffect(() => {
    async function fetchAvatarData() {
      try {
        const { avatar } = await getJobSeekerData()
        setAvatar(avatar)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching avatar data:", err)
        setError(err.message || "Failed to load avatar data")
        setLoading(false)
      }
    }

    fetchAvatarData()
  }, [])

  // Handle avatar generation
  const handleGenerateAvatar = async () => {
    if (!resumeData) return

    setGenerating(true)
    setError(null)

    try {
      // Generate the avatar
      const result = await generateAvatar({
        summary: resumeData.summary,
        yearsOfExperience: resumeData.yearsOfExperience,
        skills: resumeData.skills,
        alias: basicInfo?.alias || "Professional",
      })

      // If generation failed, show error
      if (!result.success) {
        setError(result.error || "An unexpected error occurred")
        setGenerating(false)
        return
      }

      // If we just generated the avatar, get the updated data
      const { avatar: newAvatar } = await getJobSeekerData()
      setAvatar(newAvatar)
      setGenerating(false)
    } catch (error: any) {
      console.error("Error in avatar generation:", error)
      setError(error.message || "An unexpected error occurred")
      setGenerating(false)
    }
  }

  // Navigate to dashboard

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading avatar...</p>
      </div>
    )
  }

  // If no resume data is available, show an error
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2 text-red-600">Missing Data</h3>
          <p className="text-muted-foreground">No resume data available. Please complete previous steps.</p>
        </div>
      </div>
    )
  }

  // If no avatar exists yet and we're not currently generating one
  if (!avatar && !generating && !error) {
    // Automatically trigger generation
    handleGenerateAvatar()

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-4 text-muted-foreground">Generating your avatar...</p>
      </div>
    )
  }

  // If we're currently generating
  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <p className="mt-4 text-muted-foreground">Generating your avatar...</p>
      </div>
    )
  }

  // If there was an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2 text-red-600">Avatar Generation Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleGenerateAvatar()
          }}
        >
          <ServerButton type="submit" variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Try Again</span>
          </ServerButton>
        </form>
      </div>
    )
  }

  // If avatar exists, display it
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Your Professional Avatar</h3>
        <p className="text-muted-foreground">
          Meet your new professional avatar, created based on your unique profile!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="border-4 border-primary rounded-full p-1 shadow-lg">
          <img
            src={avatar?.imageUrl || "/placeholder.svg"}
            alt="Professional Avatar"
            className="w-64 h-64 rounded-full object-cover"
          />
        </div>

        <div className="flex space-x-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleGenerateAvatar()
            }}
          >
            <ServerButton type="submit" variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Regenerate</span>
            </ServerButton>
          </form>

          <a
            href={avatar?.imageUrl}
            download={`${basicInfo?.alias || "professional"}-avatar.png`}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Download</span>
          </a>
        </div>
      </div>

      <div className="w-full pt-6 space-y-3">
        <ServerButton href="/dashboard" className="w-full">
          Complete Setup
        </ServerButton>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              const userData = await getJobSeekerData()
              console.log("User Data:", userData)
            } catch (error) {
              console.error("Error fetching user data:", error)
            }
          }}
        >
          <ServerButton type="submit" variant="outline" className="w-full flex items-center justify-center">
            <span>Debug: Log User Data</span>
          </ServerButton>
        </form>
      </div>
    </div>
  )
}
