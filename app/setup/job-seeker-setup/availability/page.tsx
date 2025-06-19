"use client"
import { useActionState, useState, useEffect } from "react"
import AvailabilityAction from "./actions"
import { useRouter } from "next/navigation"
import LilRedSpinner from "@/components/ui/lilRedSpinner"

type StoredAvailability = {
  timezone: string
  mondayStart: string
  mondayEnd: string
  tuesdayStart: string
  tuesdayEnd: string
  wednesdayStart: string
  wednesdayEnd: string
  thursdayStart: string
  thursdayEnd: string
  fridayStart: string
  fridayEnd: string
  saturdayStart: string
  saturdayEnd: string
  sundayStart: string
  sundayEnd: string
  availabilityNote: string
  completedStepFive?: boolean
}

// Comprehensive timezone list
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Toronto", label: "Eastern Time - Toronto" },
  { value: "America/Vancouver", label: "Pacific Time - Vancouver" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
  { value: "Europe/Rome", label: "Central European Time (CET)" },
  { value: "Europe/Madrid", label: "Central European Time (CET)" },
  { value: "Europe/Amsterdam", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Seoul", label: "Korea Standard Time (KST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Australia/Melbourne", label: "Australian Eastern Time (AET)" },
  { value: "Australia/Perth", label: "Australian Western Time (AWT)" },
]

export default function AvailabilityPage() {
  const [result, formAction, isPending] = useActionState(AvailabilityAction, null)
  const [persistedData, setPersistedData] = useState<StoredAvailability | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPushingNewRoute, setIsPushingNewRoute] = useState(false)
  const router = useRouter()

  // DEBUG: Add more detailed logging
  console.log("🔍 Component render - Current state:", {
    result,
    persistedData,
    isLoaded,
    isPending,
    isPushingNewRoute
  })

  // On mount, read from localStorage
  useEffect(() => {
    console.log("🔄 Mount effect running...")
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log("❌ Not in browser environment")
      setIsLoaded(true)
      return
    }

    try {
      const storedData = localStorage.getItem("availabilityInfo")
      console.log("📦 Raw localStorage data:", storedData)
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as StoredAvailability
        setPersistedData(parsedData)
        console.log("✅ Successfully loaded from localStorage:", parsedData)
      } else {
        console.log("ℹ️ No data found in localStorage")
      }
    } catch (error) {
      console.error("❌ Error reading/parsing localStorage:", error)
      // Try to clear corrupted data
      try {
        localStorage.removeItem("availabilityInfo")
        console.log("🧹 Cleared corrupted localStorage data")
      } catch (clearError) {
        console.error("❌ Could not clear localStorage:", clearError)
      }
    }
    
    setIsLoaded(true)
  }, [])

  // Save to localStorage when form is successfully submitted
  useEffect(() => {
    console.log("🔄 Result effect running with result:", result)
    
    if (result?.success && result.data) {
      console.log("✅ Form submission successful, saving data:", result.data)
      
      try {
        localStorage.setItem("availabilityInfo", JSON.stringify(result.data))
        setPersistedData(result.data)
        console.log("💾 Data successfully saved to localStorage")
        
        // Add a small delay before navigation to ensure state updates
        setTimeout(() => {
          console.log("🚀 Navigating to next page...")
          router.push("/setup/job-seeker-setup/security-clearance")
          setIsPushingNewRoute(true)
        }, 100)
        
      } catch (error) {
        console.error("❌ Error saving to localStorage:", error)
      }
    }

    if (result?.error) {
      console.error("❌ Form submission error:", result.error)
    }

    // Log if result exists but doesn't match expected structure
    if (result && !result.success && !result.error) {
      console.log("⚠️ Unexpected result structure:", result)
    }
  }, [result, router])

  // Debug: Log when persistedData changes
  useEffect(() => {
    console.log("🔄 persistedData changed:", persistedData)
  }, [persistedData])

  // Add a manual test function for localStorage
  const testLocalStorage = () => {
    try {
      const testKey = "test-storage"
      const testValue = "test-data"
      localStorage.setItem(testKey, testValue)
      const retrieved = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      console.log("🧪 localStorage test:", {
        stored: testValue,
        retrieved,
        working: testValue === retrieved
      })
      
      alert(`localStorage ${testValue === retrieved ? 'is working' : 'is NOT working'}`)
    } catch (error) {
      console.error("❌ localStorage test failed:", error)
      alert("localStorage test failed: " + error)
    }
  }

  // Don't render form until we've loaded persisted data
  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto p-6 pt-8 text-center">
        <LilRedSpinner />
        <p className="mt-2 text-gray-600">Loading your availability settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-8">
      <div className="text-center text-2xl font-bold mb-8 text-gray-800">Set Your Availability</div>
      
      <form action={formAction} className="space-y-6" key={persistedData ? "with-data" : "empty"}>
        <div className="space-y-2">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone *
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={persistedData?.timezone || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          >
            <option value="">Select your timezone</option>
            {timezones.map((timezone) => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Schedule</h3>

          {/* Monday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Monday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="mondayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="mondayStart"
                  id="mondayStart"
                  defaultValue={persistedData?.mondayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="mondayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="mondayEnd"
                  id="mondayEnd"
                  defaultValue={persistedData?.mondayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Tuesday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Tuesday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="tuesdayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="tuesdayStart"
                  id="tuesdayStart"
                  defaultValue={persistedData?.tuesdayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="tuesdayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="tuesdayEnd"
                  id="tuesdayEnd"
                  defaultValue={persistedData?.tuesdayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Wednesday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Wednesday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="wednesdayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="wednesdayStart"
                  id="wednesdayStart"
                  defaultValue={persistedData?.wednesdayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="wednesdayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="wednesdayEnd"
                  id="wednesdayEnd"
                  defaultValue={persistedData?.wednesdayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Thursday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Thursday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="thursdayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="thursdayStart"
                  id="thursdayStart"
                  defaultValue={persistedData?.thursdayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="thursdayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="thursdayEnd"
                  id="thursdayEnd"
                  defaultValue={persistedData?.thursdayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Friday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Friday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="fridayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="fridayStart"
                  id="fridayStart"
                  defaultValue={persistedData?.fridayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="fridayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="fridayEnd"
                  id="fridayEnd"
                  defaultValue={persistedData?.fridayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Saturday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Saturday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="saturdayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="saturdayStart"
                  id="saturdayStart"
                  defaultValue={persistedData?.saturdayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="saturdayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="saturdayEnd"
                  id="saturdayEnd"
                  defaultValue={persistedData?.saturdayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>

          {/* Sunday */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-3">Sunday</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sundayStart" className="text-sm text-gray-600">
                  Start
                </label>
                <input
                  name="sundayStart"
                  id="sundayStart"
                  defaultValue={persistedData?.sundayStart || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sundayEnd" className="text-sm text-gray-600">
                  End
                </label>
                <input
                  name="sundayEnd"
                  id="sundayEnd"
                  defaultValue={persistedData?.sundayEnd || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="time"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-2">
          <label htmlFor="availabilityNote" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="availabilityNote"
            id="availabilityNote"
            rows={4}
            defaultValue={persistedData?.availabilityNote || ""}
            placeholder="Add any special notes about your availability, preferred meeting times, or scheduling constraints..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          />
          <p className="text-xs text-gray-500">Optional: Help employers understand your scheduling preferences</p>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isPending || isPushingNewRoute}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending || isPushingNewRoute ? (
              <>
                <LilRedSpinner />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save and Continue</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}