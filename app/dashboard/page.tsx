import Link from "next/link"
import { UserCircle } from "lucide-react"
import { ServerButton } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
          <UserCircle className="w-32 h-32 text-muted-foreground" />
        </div>

        <div className="w-full max-w-xs">
          <Link href="/dashboard/setup-options" className="w-full">
            <ServerButton size="lg" className="w-full">
              Setup
            </ServerButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
