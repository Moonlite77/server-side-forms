import { processResume } from "@/app/actions"
import { FileText, AlertCircle } from "lucide-react"
import SubmitResume from "@/components/ui/submitResumeButton" //custom button

interface ResumeFormProps {
  userAlias?: string
}

export default function ResumeForm({ userAlias = "User" }: ResumeFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{userAlias}'s Resume</h3>

      <form action={processResume} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="resume" className="block text-sm font-medium mb-1">
              Upload Your Resume
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="resumeFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="resumeFile"
                      name="resumeFile"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.txt"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">What we'll extract from your resume:</h4>
            <ul className="text-xs space-y-1 list-disc pl-5">
              <li>Top 10 skills</li>
              <li>Last 3 companies</li>
              <li>Education history</li>
              <li>Professional summary</li>
            </ul>
            <p className="text-xs mt-2">Personal information like contact details will be removed for privacy.</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Processing Time</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Resume processing may take up to 30 seconds. Please don't close this page during processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <SubmitResume></SubmitResume>
      </form>
    </div>
  )
}
