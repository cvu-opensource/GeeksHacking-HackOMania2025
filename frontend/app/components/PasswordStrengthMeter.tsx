"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0
      if (password.length > 6) score++
      if (password.length > 10) score++
      if (/[A-Z]/.test(password)) score++
      if (/[a-z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      setStrength((score / 6) * 100)
    }

    calculateStrength()
  }, [password])

  const getColor = () => {
    if (strength < 33) return "bg-red-500"
    if (strength < 66) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="w-full mt-2">
      <Progress value={strength} className={`h-2 ${getColor()}`} />
      <p className="text-xs mt-1 text-gray-500">
        {strength < 33 && "Weak"}
        {strength >= 33 && strength < 66 && "Medium"}
        {strength >= 66 && "Strong"}
      </p>
    </div>
  )
}

