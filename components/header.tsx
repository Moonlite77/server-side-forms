import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Shield, Lock, SaveIcon as Safe, Vault, Archive, Box } from 'lucide-react'
// This would normally come from your auth provider
// For demo purposes, we'll just use a dummy value

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-[8vh]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-2">
            <Vault />
          </div>
          <span className="font-bold text-xl ">Talent Vault</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/dashboard" className="text-2xl font-black tracking-tight">
            Dashboard
          </Link>
          <Link href="/vault" className="text-2xl font-black tracking-tight">
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