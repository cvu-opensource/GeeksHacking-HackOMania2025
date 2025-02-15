"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "../contexts/UserContext"

// Placeholder user data
const placeholderUser = {
  username: "JohnDoe",
  email: "john.doe@example.com",
  linkedin: "https://www.linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  skills: [
    { name: "JavaScript", percentage: 90 },
    { name: "React", percentage: 85 },
    { name: "Node.js", percentage: 80 },
  ],
  interests: [
    { name: "Web Development", percentage: 95 },
    { name: "AI", percentage: 75 },
    { name: "Data Science", percentage: 70 },
  ],
  about: "Passionate developer with a love for creating innovative solutions.",
  region: "Central",
  age: 28,
  gender: "Male",
  projects: [
    {
      name: "Project A",
      description: "A web application for task management",
      details: "Built with React and Node.js",
      github: "https://github.com/johndoe/project-a",
      demo: "https://project-a-demo.com",
    },
    {
      name: "Project B",
      description: "An AI-powered chatbot",
      details: "Developed using Python and TensorFlow",
      github: "https://github.com/johndoe/project-b",
      demo: "https://project-b-demo.com",
    },
  ],
  events: [
    {
      title: "Tech Conference 2023",
      date: "2023-09-15",
      time: "09:00 AM",
      location: "Convention Center",
    },
    {
      title: "Hackathon",
      date: "2023-10-01",
      time: "10:00 AM",
      location: "Tech Hub",
    },
  ],
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "login")
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    region: "",
  })
  const { setUser, setIsLoggedIn } = useUser()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    console.log("Login:", loginData)
    setUser(placeholderUser)
    setIsLoggedIn(true)
    router.push("/profile")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate signup
    console.log("Signup:", signupData)
    setUser(placeholderUser)
    setIsLoggedIn(true)
    router.push("/questionnaire")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#34495E] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[800px] bg-white/10 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Welcome to GeekedIn</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Login or create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          required
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#48BB78] hover:bg-[#48BB78]/80">
                        Login
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-white">
                          Username
                        </Label>
                        <Input
                          id="signup-username"
                          type="text"
                          required
                          value={signupData.username}
                          onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          required
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          required
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-white">
                          Confirm Password
                        </Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          required
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-dob" className="text-white">
                          Date of Birth
                        </Label>
                        <Input
                          id="signup-dob"
                          type="date"
                          required
                          value={signupData.dob}
                          onChange={(e) => setSignupData({ ...signupData, dob: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-gender" className="text-white">
                          Gender
                        </Label>
                        <Select onValueChange={(value) => setSignupData({ ...signupData, gender: value })}>
                          <SelectTrigger className="bg-white/90 border-white/20 text-[#2C3E50]">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 text-[#2C3E50]">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-region" className="text-white">
                          Region
                        </Label>
                        <Select onValueChange={(value) => setSignupData({ ...signupData, region: value })}>
                          <SelectTrigger className="bg-white/90 border-white/20 text-[#2C3E50]">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/90 text-[#2C3E50]">
                            <SelectItem value="north">North</SelectItem>
                            <SelectItem value="south">South</SelectItem>
                            <SelectItem value="east">East</SelectItem>
                            <SelectItem value="west">West</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full bg-[#48BB78] hover:bg-[#48BB78]/80 col-span-2">
                        Sign Up
                      </Button>
                    </form>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

