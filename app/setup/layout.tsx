import type React from "react"
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-neutral-500 rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-auto flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
