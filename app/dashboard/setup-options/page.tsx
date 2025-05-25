import Link from "next/link"
import { ServerButton } from "@/components/ui/button"

export default function SetupOptionsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-background border rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Select your profile type</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose the option that best describes you</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/setup-job-seeker" className="w-full">
              <ServerButton variant="outline" className="h-24 w-full flex flex-col gap-2">
                <span className="text-lg font-medium">Job Seeker</span>
                <span className="text-xs text-muted-foreground">Looking for opportunities</span>
              </ServerButton>
            </Link>
            <Link href="/setup-talent-seeker" className="w-full">
              <ServerButton variant="outline" className="h-24 w-full flex flex-col gap-2">
                <span className="text-lg font-medium">Talent Seeker</span>
                <span className="text-xs text-muted-foreground">Hiring talent</span>
              </ServerButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
