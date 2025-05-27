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
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
      >
        Save and Continue
      </button>
    </form>
  )
}
