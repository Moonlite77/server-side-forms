import { saveBasicInfo } from "@/app/actions"

interface BasicInfoFormProps {
  initialData?: {
    fullName?: string
    alias?: string
    openToFullTime?: boolean
    openToContract?: boolean
    openToSpeaking?: boolean
    careerField?: string
  }
}

// IT career fields - you can expand this list as needed
const IT_CAREER_FIELDS = [
  { value: "software-development", label: "Software Development" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "devops", label: "DevOps / SRE" },
  { value: "cloud-architecture", label: "Cloud Architecture" },
  { value: "data-science", label: "Data Science" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "machine-learning", label: "Machine Learning / AI" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "database-admin", label: "Database Administration" },
  { value: "network-engineering", label: "Network Engineering" },
  { value: "it-support", label: "IT Support / Help Desk" },
  { value: "systems-admin", label: "Systems Administration" },
  { value: "qa-testing", label: "QA / Testing" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "technical-writing", label: "Technical Writing" },
  { value: "it-management", label: "IT Management" },
  { value: "enterprise-architecture", label: "Enterprise Architecture" },
  { value: "blockchain", label: "Blockchain Development" },
  { value: "game-development", label: "Game Development" },
  { value: "embedded-systems", label: "Embedded Systems" },
  { value: "other", label: "Other IT Field" }
]

export default function BasicInfoForm({ initialData }: BasicInfoFormProps) {
  return (
    <form action={saveBasicInfo} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            defaultValue={initialData?.fullName || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
          />
          <p className="text-xs text-muted-foreground mt-1">Used for identity verification only, not shown publicly</p>
        </div>

        <div>
          <label htmlFor="alias" className="block text-sm font-medium mb-1">
            Professional Alias
          </label>
          <input
            type="text"
            id="alias"
            name="alias"
            defaultValue={initialData?.alias || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="How you want to be known professionally"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">This will be visible to potential employers</p>
        </div>

        <div>
          <label htmlFor="careerField" className="block text-sm font-medium mb-1">
            Career Field
          </label>
          <select
            id="careerField"
            name="careerField"
            defaultValue={initialData?.careerField || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select your primary career field</option>
            {IT_CAREER_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Choose the field that best describes your expertise</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Employment Preferences</p>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="openToFullTime"
              name="openToFullTime"
              defaultChecked={initialData?.openToFullTime}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="openToFullTime" className="ml-2 block text-sm">
              Open to full-time employment
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="openToContract"
              name="openToContract"
              defaultChecked={initialData?.openToContract}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="openToContract" className="ml-2 block text-sm">
              Open to contract work
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="openToSpeaking"
              name="openToSpeaking"
              defaultChecked={initialData?.openToSpeaking}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="openToSpeaking" className="ml-2 block text-sm">
              Open to public speaking events
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-900 hover:ring-2 hover:ring-red-400 hover:ring-opacity-50"
      >
        Save and Continue
      </button>
    </form>
  )
}