import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
// This would normally come from your auth provider
// For demo purposes, we'll just use a dummy value

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-[8vh]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-8 w-8 text-gray-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-bold text-xl ">Talent Vault</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/vault" className="text-gray-700 hover:text-gray-900 transition-colors">
           Vault
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Auth Section */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton showName />
            </SignedIn>

      </div>

      {/* Mobile Navigation - Hidden by default */}
      <div className="hidden md:hidden">
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link
            href="/features"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            About
          </Link>
        </div>
      </div>
    </header>
  )
}