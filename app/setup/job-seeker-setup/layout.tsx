"use client"
import type React from "react"
import JobSeekerStepper from "./jobSeekerComponents/stepper"
import { DataContext } from "../contexts/customContext"
import Link from "next/link"

//creating a DataObject to pass into context provider
const userData = {
  firstName: "John",
  lastName: "Doe",
  careerField: "Software Engineering",
  alias: "CoolGuy95",
  fullTime: "no",
  contract: "no",
  speaker: "no",
  stepOne: "incomplete",
}

export default function JobSeekerSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <DataContext.Provider value={userData}>
      <div className="fixed left-0 top-0 h-full z-40 flex flex-col">
        <div className="h-full flex items-center p-6">
          <JobSeekerStepper />
        </div>
      </div>
      <div className="h-100 py-2">
        {children}
      </div>
      </DataContext.Provider>

    </div>
  )
}
