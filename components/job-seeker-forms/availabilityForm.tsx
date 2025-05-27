import { saveAvailability } from "@/app/actions"

interface AvailabilityFormProps {
  initialData?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
    timezone?: string
    notes?: string
  }
}

export default function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Your Availability</h2>

      <form action={saveAvailability} className="space-y-6">
        <div className="grid gap-4">
          {days.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <label htmlFor={key} className="text-sm font-medium text-gray-700 w-24">
                {label}
              </label>

              <div className="flex items-center space-x-4 flex-1 ml-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor={`${key}-start`} className="text-sm text-gray-600">
                    From:
                  </label>
                  <input
                    type="time"
                    id={`${key}-start`}
                    name={`${key}-start`}
                    defaultValue={initialData?.[key as keyof typeof initialData]?.split("-")[0] || "09:00"}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label htmlFor={`${key}-end`} className="text-sm text-gray-600">
                    To:
                  </label>
                  <input
                    type="time"
                    id={`${key}-end`}
                    name={`${key}-end`}
                    defaultValue={initialData?.[key as keyof typeof initialData]?.split("-")[1] || "17:00"}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${key}-unavailable`}
                    name={`${key}-unavailable`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`${key}-unavailable`} className="ml-2 text-sm text-gray-600">
                    Unavailable
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={initialData?.timezone || "America/New_York"}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any additional information about your availability..."
              defaultValue={initialData?.notes || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="mx-auto block px-6 py-3 bg-red-800 text-white font-medium rounded-lg transition-all duration-200 hover:bg-red-900 hover:ring-2 hover:ring-red-400 hover:ring-opacity-50"
          >
            Save Availability
          </button>
        </div>
      </form>
    </div>
  )
}
