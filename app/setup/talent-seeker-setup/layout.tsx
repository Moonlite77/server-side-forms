import type React from "react"
import Link from "next/link"

export default function TalentSeekerSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-black">Talent-Seeker Setup</h1>
      </div>

      <div className="border-b border-gray-200 pb-2">
        <p className="text-black">Complete your profile to find job-seekers</p>
      </div>

      <div className="py-2">{children}</div>

      <div className="text-sm text-black pt-4 border-t border-gray-100">
        <p>Your information is secure</p>
      </div>
    </div>
  )
}
