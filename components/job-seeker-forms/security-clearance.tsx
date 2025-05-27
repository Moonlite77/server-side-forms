import { saveSecurityClearance } from "@/app/actions"
import { AlertCircle } from "lucide-react"

interface SecurityClearanceFormProps {
  initialData?: {
    hasClearance?: boolean
    clearanceLevel?: string
    clearanceStatus?: "active" | "inactive" | "pending"
    expirationDate?: string
    willingToApply?: boolean
  }
}

export default function SecurityClearanceForm({ initialData }: SecurityClearanceFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Security Clearance Information</h3>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Why we ask</h4>
            <p className="text-xs text-blue-700 mt-1">
              Some positions require security clearances. This information helps match you with appropriate
              opportunities. All clearance information is kept confidential.
            </p>
          </div>
        </div>
      </div>

      <form action={saveSecurityClearance} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Do you currently hold a security clearance?</p>

            <div className="flex items-center">
              <input
                type="radio"
                id="hasClearanceYes"
                name="hasClearance"
                value="yes"
                defaultChecked={initialData?.hasClearance === true}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                required
              />
              <label htmlFor="hasClearanceYes" className="ml-2 block text-sm">
                Yes
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="hasClearanceNo"
                name="hasClearance"
                value="no"
                defaultChecked={initialData?.hasClearance === false}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="hasClearanceNo" className="ml-2 block text-sm">
                No
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="clearanceLevel" className="block text-sm font-medium mb-1">
              Clearance Level (if applicable)
            </label>
            <select
              id="clearanceLevel"
              name="clearanceLevel"
              defaultValue={initialData?.clearanceLevel || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a clearance level</option>
              <option value="confidential">Confidential</option>
              <option value="secret">Secret</option>
              <option value="topsecret">Top Secret</option>
              <option value="tssci">TS/SCI</option>
              <option value="q">Q Clearance</option>
              <option value="l">L Clearance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="clearanceStatus" className="block text-sm font-medium mb-1">
              Clearance Status (if applicable)
            </label>
            <select
              id="clearanceStatus"
              name="clearanceStatus"
              defaultValue={initialData?.clearanceStatus || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium mb-1">
              Expiration Date (if applicable)
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              defaultValue={initialData?.expirationDate || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="willingToApply"
                name="willingToApply"
                defaultChecked={initialData?.willingToApply}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="willingToApply" className="ml-2 block text-sm">
                I am willing to apply for a security clearance if required for a position
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto block px-6 py-3 bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-900 hover:ring-2 hover:ring-red-400 hover:ring-opacity-50"
        >
          Save and Continue
        </button>
      </form>
    </div>
  )
}
