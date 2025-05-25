import { saveLocationAndWorkPreferences } from "@/app/actions"

interface LocationAndWorkPreferencesFormProps {
  initialData?: {
    country?: string
    city?: string
    workPreference?: "remote" | "hybrid" | "onsite"
    willingToRelocate?: boolean
    preferredLocations?: string[]
  }
}

export default function LocationAndWorkPreferencesForm({ initialData }: LocationAndWorkPreferencesFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Location & Work Preferences</h3>

      <form action={saveLocationAndWorkPreferences} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country of Residence
            </label>
            <select
              id="country"
              name="country"
              defaultValue={initialData?.country || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="" disabled>
                Select a country
              </option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={initialData?.city || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your city"
              required
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Work Preference</p>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="remote"
                  name="workPreference"
                  value="remote"
                  defaultChecked={initialData?.workPreference === "remote"}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  required
                />
                <label htmlFor="remote" className="ml-2 block text-sm">
                  Remote (100% work from home)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="hybrid"
                  name="workPreference"
                  value="hybrid"
                  defaultChecked={initialData?.workPreference === "hybrid"}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="hybrid" className="ml-2 block text-sm">
                  Hybrid (mix of remote and on-site)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="onsite"
                  name="workPreference"
                  value="onsite"
                  defaultChecked={initialData?.workPreference === "onsite"}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="onsite" className="ml-2 block text-sm">
                  On-site (in-office work)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="willingToRelocate"
                name="willingToRelocate"
                defaultChecked={initialData?.willingToRelocate}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="willingToRelocate" className="ml-2 block text-sm">
                I am willing to relocate for the right opportunity
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="preferredLocations" className="block text-sm font-medium mb-1">
              Preferred Locations (if willing to relocate)
            </label>
            <input
              type="text"
              id="preferredLocations"
              name="preferredLocations"
              defaultValue={initialData?.preferredLocations?.join(", ") || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., New York, San Francisco, London"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate multiple locations with commas</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Save and Continue
        </button>
      </form>
    </div>
  )
}
