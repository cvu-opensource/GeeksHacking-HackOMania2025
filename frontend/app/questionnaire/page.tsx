"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const regions = ["North", "South", "East", "West", "Central", "Others"]

const sampleInterests = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Internet of Things",
  "Virtual Reality",
  "Augmented Reality",
  "Game Development",
  "Robotics",
  "3D Printing",
  "Quantum Computing",
  "Bioinformatics",
  "Nanotechnology",
  "Space Technology",
  "Green Tech",
  "Fintech",
  "E-commerce",
  "Digital Marketing",
  "UX/UI Design",
  "DevOps",
]

const sampleSkills = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Swift",
  "Kotlin",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "SQL",
  "NoSQL",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Agile",
  "Scrum",
  "Project Management",
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
]

export default function QuestionnairePage() {
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const [filteredInterests, setFilteredInterests] = useState<string[]>([])
  const [region, setRegion] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [filteredSkills, setFilteredSkills] = useState<string[]>([])
  const [interestWeights, setInterestWeights] = useState<Record<string, number>>({})
  const [skillWeights, setSkillWeights] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    if (newInterest) {
      const filtered = sampleInterests.filter((interest) => interest.toLowerCase().includes(newInterest.toLowerCase()))
      setFilteredInterests(filtered)
    } else {
      setFilteredInterests([])
    }
  }, [newInterest])

  useEffect(() => {
    if (newSkill) {
      const filtered = sampleSkills.filter((skill) => skill.toLowerCase().includes(newSkill.toLowerCase()))
      setFilteredSkills(filtered)
    } else {
      setFilteredSkills([])
    }
  }, [newSkill])

  const handleAddInterest = (interest: string) => {
    if (interest && !interests.includes(interest) && interests.length < 5) {
      setInterests([...interests, interest])
      setNewInterest("")
      setFilteredInterests([])
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
    setInterestWeights((prevWeights) => {
      const { [interest]: removed, ...rest } = prevWeights
      return rest
    })
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill) && skills.length < 5) {
      setSkills([...skills, skill])
      setNewSkill("")
      setFilteredSkills([])
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
    setSkillWeights((prevWeights) => {
      const { [skill]: removed, ...rest } = prevWeights
      return rest
    })
  }

  const handleInterestWeight = (interest: string, weight: number) => {
    setInterestWeights({ ...interestWeights, [interest]: weight })
  }

  const handleSkillWeight = (skill: string, weight: number) => {
    setSkillWeights({ ...skillWeights, [skill]: weight })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement logic to save user preferences
    console.log("User preferences:", { interests, interestWeights, skills, skillWeights })
    // Redirect to profiles page
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#34495E] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[800px] bg-white/10 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Tell us about yourself</CardTitle>
            <CardDescription className="text-center text-gray-300">Help us personalize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-white">
                  Your Interests (Max 5)
                </Label>
                <div className="relative">
                  <Input
                    id="interests"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {filteredInterests.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white/80 border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredInterests.map((interest) => (
                        <div
                          key={interest}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-[#2C3E50]"
                          onClick={() => handleAddInterest(interest)}
                        >
                          {interest}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Badge className="bg-[#D2B48C]/20 text-[#D2B48C]">{interest}</Badge>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={interestWeights[interest] || 50}
                        onChange={(e) => handleInterestWeight(interest, Number.parseInt(e.target.value))}
                        className="flex-grow"
                      />
                      <span className="text-white">{interestWeights[interest] || 50}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="skills" className="text-white">
                  Your Skills (Max 5)
                </Label>
                <div className="relative">
                  <Input
                    id="skills"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {filteredSkills.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white/80 border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSkills.map((skill) => (
                        <div
                          key={skill}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-[#2C3E50]"
                          onClick={() => handleAddSkill(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  {skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Badge className="bg-[#D2B48C]/20 text-[#D2B48C]">{skill}</Badge>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skillWeights[skill] || 50}
                        onChange={(e) => handleSkillWeight(skill, Number.parseInt(e.target.value))}
                        className="flex-grow"
                      />
                      <span className="text-white">{skillWeights[skill] || 50}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#48BB78] hover:bg-[#48BB78]/80">
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

