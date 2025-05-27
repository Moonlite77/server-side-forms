"use client"

import type React from "react"

import { saveVerifiedData } from "@/app/actions"
import { AlertCircle } from "lucide-react"

interface VerifyParsedDataFormProps {
  resumeData: {
    summary: string
    skills: string[]
    companies: { name: string; position: string }[]
    education: { institution: string; degree: string; year: string }[]
    yearsOfExperience: number
  }
}

export default function VerifyParsedDataForm({ resumeData }: VerifyParsedDataFormProps) {
  // Log when component is rendered and what data it receives
  console.log("VerifyParsedDataForm rendering with resumeData:", resumeData)
  console.log("resumeData type:", typeof resumeData)
  console.log("resumeData keys:", resumeData ? Object.keys(resumeData) : "null")

  // Add safety check for missing data
  if (!resumeData) {
    console.log("resumeData is null or undefined")
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800 mb-2">Resume Data Error</h3>
        <p className="text-red-700">
          There was a problem processing your resume data. Please go back and try uploading your resume again.
        </p>
        <a
          href="/setup-job-seeker?step=2"
          className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Back to Resume Upload
        </a>
      </div>
    )
  }

  if (!resumeData.skills) {
    console.log("resumeData.skills is missing")
  }

  if (!resumeData.companies) {
    console.log("resumeData.companies is missing")
  }

  if (!resumeData.education) {
    console.log("resumeData.education is missing")
  }

  if (!resumeData || !resumeData.skills || !resumeData.companies || !resumeData.education) {
    console.log("Safety check failed - missing required data")
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800 mb-2">Resume Data Error</h3>
        <p className="text-red-700">
          There was a problem processing your resume data. Please go back and try uploading your resume again.
        </p>
        <a
          href="/setup-job-seeker?step=2"
          className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Back to Resume Upload
        </a>
      </div>
    )
  }

  console.log("Safety check passed - all required data is present")
  console.log("Summary length:", resumeData.summary?.length || 0)
  console.log("Skills count:", resumeData.skills?.length || 0)
  console.log("Companies count:", resumeData.companies?.length || 0)
  console.log("Education count:", resumeData.education?.length || 0)
  console.log("Years of experience:", resumeData.yearsOfExperience)

  // Create a function to log form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submission started")
    // The form will continue with the server action
  }

  return (
    <form action={saveVerifiedData} onSubmit={handleFormSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Professional Summary</h4>
          <textarea
            name="summary"
            defaultValue={resumeData.summary}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">Edit if needed to better represent your experience.</p>
        </div>

        {/* Years of Experience Verification */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Verify Your Experience</h4>
              <p className="text-xs text-blue-700 mt-1">
                We detected approximately {resumeData.yearsOfExperience} years of professional experience from your
                resume. Please verify or adjust this number.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium mb-1 text-blue-800">
              Total Years of Professional Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              min="0"
              max="50"
              step="0.5"
              defaultValue={resumeData.yearsOfExperience}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              required
            />
          </div>

          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="confirmedExperience"
              name="confirmedExperience"
              className="h-4 w-4 text-primary focus:ring-primary border-blue-300 rounded"
              required
            />
            <label htmlFor="confirmedExperience" className="ml-2 block text-sm text-blue-800">
              I confirm this experience information is accurate
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Top Skills</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {resumeData.skills.map((skill, index) => {
              console.log(`Rendering skill ${index}:`, skill)
              return (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    name={`skill-${index}`}
                    defaultValue={skill}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Edit your skills to highlight your strengths.</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Work Experience</h4>
          {resumeData.companies.map((company, index) => {
            console.log(`Rendering company ${index}:`, company)
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                  <label htmlFor={`company-${index}`} className="block text-xs mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id={`company-${index}`}
                    name={`company-${index}`}
                    defaultValue={company.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor={`position-${index}`} className="block text-xs mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id={`position-${index}`}
                    name={`position-${index}`}
                    defaultValue={company.position}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Education</h4>
          {resumeData.education.map((edu, index) => {
            console.log(`Rendering education ${index}:`, edu)
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <div>
                  <label htmlFor={`institution-${index}`} className="block text-xs mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    id={`institution-${index}`}
                    name={`institution-${index}`}
                    defaultValue={edu.institution}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor={`degree-${index}`} className="block text-xs mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    id={`degree-${index}`}
                    name={`degree-${index}`}
                    defaultValue={edu.degree}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor={`year-${index}`} className="block text-xs mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    id={`year-${index}`}
                    name={`year-${index}`}
                    defaultValue={edu.year}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        className="mx-auto block px-6 py-3 bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-900 hover:ring-2 hover:ring-red-400 hover:ring-opacity-50"
        onClick={() => console.log("Submit button clicked")}
      >
        Confirm and Continue
      </button>
    </form>
  )
}
