import type React from "react"
import Link from "next/link"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for merging class names
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ServerButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  href?: string
  disabled?: boolean
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
}

export function ServerButton({
  className,
  variant = "default",
  size = "default",
  href,
  disabled = false,
  children,
  type = "button",
  ...props
}: ServerButtonProps) {
  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground": variant === "outline",
      "bg-transparent hover:bg-accent hover:text-accent-foreground": variant === "ghost",
      "text-primary underline-offset-4 hover:underline": variant === "link",
      "h-10 px-4 py-2": size === "default",
      "h-9 rounded-md px-3": size === "sm",
      "h-11 rounded-md px-8": size === "lg",
      "h-10 w-10": size === "icon",
    },
    className,
  )

  // If href is provided and not disabled, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button className={buttonClasses} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  )
}
