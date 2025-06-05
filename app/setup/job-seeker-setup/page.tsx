import Link from "next/link"

export default function JobSeekerPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Before We Begin</h2>

        <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
          <p className="text-black leading-relaxed">
            Please take a second to review a few things:
          </p>

          <ul className="space-y-2 text-black">
            <li className="flex items-start">
              <span className="text-red-900 mr-2">•</span>
              Your profile information will be visible to potential employers
            </li>
            <li className="flex items-start">
              <span className="text-red-900 mr-2">•</span>
              We will use your data to match you with relevant job opportunities
            </li>
            <li className="flex items-start">
              <span className="text-red-900 mr-2">•</span>
              You can update or delete your profile at any time
            </li>
            <li className="flex items-start">
              <span className="text-red-900 mr-2">•</span>
              We respect your privacy and will not share your data without consent
            </li>
          </ul>

          <p className="text-black text-sm">By proceeding, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-medium text-black text-center">Do you accept these terms and conditions?</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/setup"
            className="px-8 py-3 border-2 border-gray-300 text-black rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300/20"
          >
            No, Go Back
          </Link>

          <Link
            href="/setup/job-seeker-setup/basic-info"
            className="px-8 py-3 bg-red-900 text-white rounded-lg font-medium hover:bg-red-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-900/20"
          >
            Yes, I Accept
          </Link>
        </div>
      </div>
    </div>
  )
}
