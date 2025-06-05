import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Setup</h1>
        <p className="text-lg text-black">Let's get you started. What best describes you?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/setup/job-seeker-setup"
          className="group block p-8 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-red-900 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-black group-hover:text-grey-900 transition-colors duration-200">
              Job Seeker
            </h2>
            <p className="text-black group-hover:text-gray-900 transition-colors duration-200">
              I'm looking for job opportunities and want to showcase my skills
            </p>
          </div>
        </Link>

        <Link
          href="/setup/talent-seeker-setup"
          className="group block p-8 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-red-900 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/20"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-black group-hover:text-gray-900 transition-colors duration-200">
              Talent Seeker
            </h2>
            <p className="text-black group-hover:text-gray-900 transition-colors duration-200">
              I'm looking to hire talented individuals for my organization
            </p>
          </div>
        </Link>
      </div>

      <div className="pt-4">
        <p className="text-sm text-black">Please note that you cannot change your profile type after completing setup!</p>
      </div>
    </div>
  )
}
