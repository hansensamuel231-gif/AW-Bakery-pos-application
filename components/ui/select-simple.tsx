import React from "react"
import { cn } from "@/lib/utils"

export interface SelectSimpleProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

export const SelectSimple = React.forwardRef<
  HTMLSelectElement,
  SelectSimpleProps
>(({ className, options, placeholder, value, ...props }, ref) => (
  <select
    ref={ref}
    value={value || ""}
    className={cn(
      "flex h-10 w-full cursor-pointer rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:shadow-md transition-all duration-200 text-foreground font-medium",
      className
    )}
    {...props}
  >
    {placeholder && (
      <option value="" disabled hidden>
        {placeholder}
      </option>
    )}
    {options && options.length > 0 && options.map((option) => (
      <option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </option>
    ))}
  </select>
))

SelectSimple.displayName = "SelectSimple"
