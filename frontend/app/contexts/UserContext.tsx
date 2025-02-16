"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Skill = {
  name: string
  percentage: number
}

type Interest = {
  name: string
  percentage: number
}

type UserContextType = {
  user: {
    username: string
    email: string
    linkedin: string
    github: string
    skills: Skill[]
    interests: Interest[]
    about: string
    region: string
    age: number
    gender: string
  } | null
  setUser: React.Dispatch<React.SetStateAction<UserContextType["user"]>>
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType["user"]>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Here you would typically check for an existing session
    // and load user data from localStorage or an API
    const storedUser = localStorage.getItem("user")
    const storedLoginState = localStorage.getItem("isLoggedIn")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedLoginState) {
      setIsLoggedIn(JSON.parse(storedLoginState))
    }
  }, [])

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn))
  }, [user, isLoggedIn])

  return <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

