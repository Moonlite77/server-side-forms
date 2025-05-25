import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { ServerButton } from "@/components/ui/button"
import BasicInfoForm from "@/components/job-seeker-forms/basicInfoForm"
import ResumeForm from "@/components/job-seeker-forms/resumeForm"
import VerifyParsedDataForm from "@/components/job-seeker-forms/verify-parsed-data-form"
import LocationAndWorkPreferencesForm from "@/components/job-seeker-forms/cc-and-work-preferences"
import SecurityClearanceForm from "@/components/job-seeker-forms/security-clearance"
import GenerateAvatar from "@/components/job-seeker-forms/generate-avatar"
import { getJobSeekerData } from "@/app/actions"

// Use the provided type definitions
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// Define the page props using the provided types
interface PageProps {
  params: Params
  searchParams: SearchParams
}

// Define the ResumeData type to match what's in actions.ts
interface ResumeData {
  resumeUrl: string
  skills: string[]
  companies: { name: string; position: string }[]
  education: { institution: string; degree: string; year: string }[]
  summary: string
  cleanedResume: string
  yearsOfExperience: number
}

export default async function SetupJobSeeker({ searchParams }: PageProps) {
  // Await the searchParams Promise to get the actual values
  const resolvedParams = await searchParams
  const step = typeof resolvedParams.step === "string" ? resolvedParams.step : "1"
  const currentStepIndex = Number(step) - 1

  // Get saved data
  const { basicInfo, resumeData, locationPrefs, clearance, avatar } = await getJobSeekerData()

  console.log("Page loaded with step:", step)
  console.log("Resume data available:", !!resumeData)
  if (resumeData) {
    console.log("Resume data preview:", JSON.stringify(resumeData).substring(0, 100) + "...")
  }

  const steps = [
    { id: 1, name: "Basic Info", path: "/setup-job-seeker?step=1" },
    { id: 2, name: "Resume", path: "/setup-job-seeker?step=2" },
    { id: 3, name: "Verify parsed data", path: "/setup-job-seeker?step=3" },
    { id: 4, name: "Location & Work", path: "/setup-job-seeker?step=4" },
    { id: 5, name: "Clearance", path: "/setup-job-seeker?step=5" },
    { id: 6, name: "Generate Avatar", path: "/setup-job-seeker?step=6" },
  ]

  const isLastStep = currentStepIndex === steps.length - 1
  const currentStep = steps[currentStepIndex] || steps[0]
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null
  const nextStep = !isLastStep ? steps[currentStepIndex + 1] : null

  // Render the appropriate form based on the current step
  function renderStepContent() {
    switch (currentStepIndex) {
      case 0:
        return <BasicInfoForm initialData={basicInfo} />
      case 1:
        return <ResumeForm userAlias={basicInfo?.alias} />
      case 2:
        return resumeData ? (
          <VerifyParsedDataForm resumeData={resumeData as ResumeData} />
        ) : (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">No Resume Data</h3>
            <p className="text-muted-foreground">No resume data available. Please go back and upload your resume.</p>
            <ServerButton href="/setup-job-seeker?step=2" className="mt-4">
              Go to Resume Upload
            </ServerButton>
          </div>
        )
      case 3:
        return <LocationAndWorkPreferencesForm initialData={locationPrefs} />
      case 4:
        return <SecurityClearanceForm initialData={clearance} />
      case 5:
        return <GenerateAvatar resumeData={resumeData} basicInfo={basicInfo} />
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <div className="flex flex-col h-[92vh] w-full">
      {/* Steps indicator - fixed at top */}
      <div className="w-full px-4 py-4 md:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Progress">
            <ol className="flex items-center overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <li key={step.id} className="relative flex-1 min-w-[100px]">
                  {index < currentStepIndex ? (
                    <div className="group flex w-full items-center">
                      <span className="flex items-center px-2 md:px-6">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                          <Check className="h-5 w-5 text-primary-foreground" />
                        </span>
                        <span className="ml-3 text-sm font-medium text-foreground">{step.name}</span>
                      </span>
                      {index < steps.length - 1 && <div className="h-0.5 w-full bg-primary" />}
                    </div>
                  ) : index === currentStepIndex ? (
                    <div className="group flex w-full items-center" aria-current="step">
                      <span className="flex items-center px-2 md:px-6">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                          <span className="text-sm font-medium text-primary">{step.id}</span>
                        </span>
                        <span className="ml-3 text-sm font-medium text-foreground">{step.name}</span>
                      </span>
                      {index < steps.length - 1 && <div className="h-0.5 w-full bg-muted" />}
                    </div>
                  ) : (
                    <div className="group flex w-full items-center">
                      <span className="flex items-center px-2 md:px-6">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-muted">
                          <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
                        </span>
                        <span className="ml-3 text-sm font-medium text-muted-foreground">{step.name}</span>
                      </span>
                      {index < steps.length - 1 && <div className="h-0.5 w-full bg-muted" />}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24">
        <div className="max-w-5xl mx-auto w-full py-4">
          <div className="bg-transparent rounded-lg p-6 border border-border">{renderStepContent()}</div>
        </div>
      </div>

      {/* Navigation buttons - fixed at bottom */}
      <div className="w-full px-4 py-4 md:px-8 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-between">
          {prevStep ? (
            <ServerButton variant="outline" href={prevStep.path}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </ServerButton>
          ) : (
            <ServerButton variant="outline" disabled>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </ServerButton>
          )}

          {nextStep && currentStepIndex !== 5 ? (
            <ServerButton href={nextStep.path}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </ServerButton>
          ) : currentStepIndex === 5 ? (
            <div></div> // Empty div to maintain flex layout
          ) : (
            <ServerButton>Finish</ServerButton>
          )}
        </div>
      </div>
    </div>
  )
}
