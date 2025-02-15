"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, ExternalLink, Calendar, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUser } from "../contexts/UserContext"

export default function Profile() {
  const { user, isLoggedIn, setIsLoggedIn } = useUser()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  const numberOfConnections = user.connections ? user.connections.length : 0

  // Removed handleSignOut function as it's no longer used

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#2D3748]">
      {/* Navigation */}
      <nav className="bg-[#D2B48C] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/home" className="text-2xl font-bold text-[#2D3748]">
            GeekedIn
          </Link>
          <div className="space-x-4">
            <Link href="/home" className="text-[#2D3748] hover:text-[#4A5568]">
              Home
            </Link>
            <Link href="/events" className="text-[#2D3748] hover:text-[#4A5568]">
              Events
            </Link>
            <Link href="/forums" className="text-[#2D3748] hover:text-[#4A5568]">
              Forums
            </Link>
            <Link href="/profile" className="text-[#2D3748] hover:text-[#4A5568]">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.username}</CardTitle>
                  <p className="text-[#4A5568]">{user.title}</p>
                  <p className="text-[#4A5568]">
                    {user.gender}, {user.age} years old
                  </p>
                  <p className="text-[#4A5568]">
                    {numberOfConnections} connection{numberOfConnections !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={user.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  <Link href="/profile/edit">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About Me</h3>
                <p className="text-[#4A5568]">{user.about}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge
                      key={skill.name}
                      className="bg-[#D2B48C] text-[#2D3748] px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge
                      key={interest.name}
                      className="bg-[#D2B48C] text-[#2D3748] px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {interest.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.projects.map((project, index) => (
                    <Card
                      key={index}
                      className={`rounded-lg overflow-hidden ${selectedProject === `item-${index}` ? "border border-[#D2B48C]" : "border-0"}`}
                    >
                      <Accordion type="single" collapsible value={selectedProject} onValueChange={setSelectedProject}>
                        <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger className="px-4 py-2 bg-[#D2B48C] text-[#2D3748] hover:bg-[#C1A478]">
                            <h4 className="font-semibold text-left">{project.name}</h4>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2">
                            <p className="text-sm text-[#4A5568] mb-2">{project.description}</p>
                            <p className="text-sm text-[#4A5568] mb-4">{project.details}</p>
                            <div className="flex space-x-2">
                              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <Github className="h-4 w-4 mr-2" />
                                  GitHub
                                </Button>
                              </Link>
                              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Demo
                                </Button>
                              </Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.events.map((event, index) => (
                    <Card
                      key={index}
                      className={`rounded-lg overflow-hidden ${selectedEvent === `event-${index}` ? "border border-[#D2B48C]" : "border-0"}`}
                    >
                      <Accordion type="single" collapsible value={selectedEvent} onValueChange={setSelectedEvent}>
                        <AccordionItem value={`event-${index}`}>
                          <AccordionTrigger className="px-4 py-2 bg-[#D2B48C] text-[#2D3748] hover:bg-[#C1A478]">
                            <h4 className="font-semibold text-left">{event.title}</h4>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Calendar className="mr-2 h-4 w-4" />
                              {event.date} at {event.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {event.location}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-[#D2B48C] py-8 mt-8">
        <div className="container mx-auto text-center text-[#2D3748]">
          <p>&copy; 2023 GeekedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

