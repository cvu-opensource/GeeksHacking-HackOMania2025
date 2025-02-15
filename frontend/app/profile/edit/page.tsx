"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock user data (in a real app, this would come from a database or API)
const initialUser = {
  name: "Jane Doe",
  avatar: "https://i.pravatar.cc/150?img=68",
  about:
    "Passionate about creating innovative solutions using cutting-edge technologies. Always eager to learn and collaborate on exciting projects.",
  skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning", "UI/UX Design"],
  projects: [
    {
      name: "AI Chatbot",
      description: "A conversational AI using natural language processing",
      details:
        "Implemented using Python and TensorFlow. Utilizes BERT for understanding context and generating human-like responses.",
      github: "https://github.com/janedoe/ai-chatbot",
      demo: "https://ai-chatbot-demo.vercel.app",
    },
    {
      name: "VR Game",
      description: "An immersive virtual reality game set in a cyberpunk world",
      details:
        "Developed using Unity and C#. Features procedurally generated environments and a unique hacking mechanic.",
      github: "https://github.com/janedoe/vr-cyberpunk-game",
      demo: "https://vr-cyberpunk-game.itch.io",
    },
  ],
  linkedin: "https://www.linkedin.com/in/janedoe",
  github: "https://github.com/janedoe",
  email: "jane.doe@example.com",
  dateOfBirth: "1995-05-15",
  gender: "Female",
}

export default function EditProfile() {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [newSkill, setNewSkill] = useState("")
  const [newProject, setNewProject] = useState({ name: "", description: "", details: "", github: "", demo: "" })
  const [skillWeights, setSkillWeights] = useState<Record<string, number>>({})
  const [interestWeights, setInterestWeights] = useState<Record<string, number>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill && !user.skills.includes(newSkill)) {
      setUser((prevUser) => ({ ...prevUser, skills: [...prevUser.skills, newSkill] }))
      setNewSkill("")
    }
  }

  const handleSkillWeight = (skill: string, weight: number) => {
    setSkillWeights({ ...skillWeights, [skill]: weight })
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      skills: prevUser.skills.filter((skill) => skill !== skillToRemove),
    }))
    setSkillWeights((prevWeights) => {
      const { [skillToRemove]: removed, ...rest } = prevWeights
      return rest
    })
  }

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      setUser((prevUser) => ({ ...prevUser, projects: [...prevUser.projects, newProject] }))
      setNewProject({ name: "", description: "", details: "", github: "", demo: "" })
    }
  }

  const handleRemoveProject = (indexToRemove: number) => {
    setUser((prevUser) => ({
      ...prevUser,
      projects: prevUser.projects.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prevProject) => ({ ...prevProject, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, you would send the updated user data to your backend here
    console.log("Saving user data:", {
      ...user,
      skills: user.skills.map((skill) => ({
        name: skill,
        weight: skillWeights[skill] || 50,
      })),
    })
    // Redirect to profile page after saving
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#2D3748]">
      {/* Navigation */}
      <nav className="bg-[#D2B48C] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#2D3748]">
            GeeksConnect
          </Link>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => router.push("/profile")}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={user.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  value={user.gender}
                  onValueChange={(value) => setUser({ ...user, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea id="about" name="about" value={user.about} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {user.skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Badge className="bg-[#D2B48C]/20 text-[#2D3748]">{skill}</Badge>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skillWeights[skill] || 50}
                        onChange={(e) => handleSkillWeight(skill, Number.parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span>{skillWeights[skill] || 50}%</span>
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="New skill"
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Add Skill
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Projects</Label>
                {user.projects.map((project, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-4">
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-sm text-[#4A5568]">{project.description}</p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProject(index)}
                        className="mt-2"
                      >
                        Delete Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Card>
                  <CardContent className="pt-4 space-y-2">
                    <Input
                      name="name"
                      value={newProject.name}
                      onChange={handleProjectChange}
                      placeholder="Project name"
                    />
                    <Input
                      name="description"
                      value={newProject.description}
                      onChange={handleProjectChange}
                      placeholder="Project description"
                    />
                    <Input
                      name="details"
                      value={newProject.details}
                      onChange={handleProjectChange}
                      placeholder="Project details"
                    />
                    <Input
                      name="github"
                      value={newProject.github}
                      onChange={handleProjectChange}
                      placeholder="GitHub link"
                    />
                    <Input name="demo" value={newProject.demo} onChange={handleProjectChange} placeholder="Demo link" />
                    <Button type="button" onClick={handleAddProject}>
                      Add Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input id="linkedin" name="linkedin" value={user.linkedin} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile</Label>
                <Input id="github" name="github" value={user.github} onChange={handleInputChange} />
              </div>
              <Button type="button" onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-[#D2B48C] py-8 mt-8">
        <div className="container mx-auto text-center text-[#2D3748]">
          <p>&copy; 2023 GeeksConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

