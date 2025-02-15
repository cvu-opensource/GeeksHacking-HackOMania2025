"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for events
const events = [
  {
    id: 1,
    title: "Code & Coffee",
    date: "May 15, 2023",
    time: "9:00 AM",
    location: "The Coffee Bean, Orchard Road",
    attendees: 42,
    cost: 0,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Retro Gaming Night",
    date: "May 20, 2023",
    time: "7:00 PM",
    location: "Pixel Gaming Cafe, Bugis",
    attendees: 56,
    cost: 25,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "AI Hackathon",
    date: "June 1-3, 2023",
    time: "9:00 AM",
    location: "Singapore Expo Hall 3",
    attendees: 120,
    cost: 50,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Web3 Workshop",
    date: "June 5, 2023",
    time: "2:00 PM",
    location: "Virtual Event",
    attendees: 85,
    cost: 30,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "Data Science Meetup",
    date: "June 10, 2023",
    time: "6:30 PM",
    location: "Google Singapore Office",
    attendees: 95,
    cost: 0,
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Mock data for community members
const communityMembers = [
  {
    name: "Alice",
    interests: ["AI", "Robotics"],
    avatar: "https://i.pravatar.cc/150?img=1",
    description:
      "As a passionate AI researcher, I'm dedicated to developing ethical AI solutions that can help solve real-world problems. Currently working on machine learning models that...",
  },
  {
    name: "Bob",
    interests: ["VR", "Game Dev"],
    avatar: "https://i.pravatar.cc/150?img=2",
    description:
      "Game developer by day, VR enthusiast by night. I'm building immersive experiences that push the boundaries of virtual reality. My latest project involves creating a...",
  },
  {
    name: "Charlie",
    interests: ["Cybersecurity", "IoT"],
    avatar: "https://i.pravatar.cc/150?img=3",
    description:
      "Cybersecurity expert focusing on IoT device protection. With the increasing number of connected devices, I'm working on developing secure protocols that...",
  },
  {
    name: "Diana",
    interests: ["Data Science", "Machine Learning"],
    avatar: "https://i.pravatar.cc/150?img=4",
    description:
      "Transforming raw data into meaningful insights is my passion. As a data scientist, I've been working with various organizations to implement machine learning solutions that...",
  },
]

const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

const EventCarousel = () => {
  const router = useRouter()
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

  useEffect(() => {
    let interval
    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % events.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isPaused])

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + events.length) % events.length)
  }

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % events.length)
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button variant="ghost" size="icon" onClick={handlePrevious} className="bg-white/10 hover:bg-white/20">
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button variant="ghost" size="icon" onClick={handleNext} className="bg-white/10 hover:bg-white/20">
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {events.map((event, index) => (
          <div key={event.id} className="w-full flex-shrink-0 px-4">
            <Card className="w-[300px] mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/10 backdrop-blur-sm border-0">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={300}
                height={150}
                className="h-[150px] w-full object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl text-white">{event.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {event.date} at {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-white">{event.location}</p>
                <p className="text-sm text-gray-300">
                  {event.attendees} attendees • {event.cost === 0 ? "Free" : `$${event.cost}`}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/80 text-white"
                  onClick={() => router.push("/login")}
                >
                  Sign Up
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#34495E] text-white">
      {/* Navigation */}
      <nav className="bg-[#D2B48C]/90 backdrop-blur-sm p-4 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#2D3748] hover:text-[#4A5568] transition-colors">
            GeekedIn
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D2B48C]/20 to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#D2B48C] bg-clip-text text-transparent"
          >
            Welcome to GeekedIn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 text-gray-300"
          >
            Your platform to connect with like-minded geeks and discover exciting events!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#48BB78] hover:bg-[#48BB78]/80 text-white text-lg px-8 py-3 rounded-full transition-all duration-300"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gradient-to-b from-[#2C3E50] to-[#34495E]">
        <div className="container mx-auto">
          <FadeInSection>
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Upcoming Geeky Events</h2>
          </FadeInSection>
          <FadeInSection delay={0.2}>
            <EventCarousel />
          </FadeInSection>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="py-16 bg-gradient-to-b from-[#34495E] to-[#2C3E50]">
        <div className="container mx-auto">
          <FadeInSection>
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Meet Our Geek Community</h2>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityMembers.map((member, index) => (
              <FadeInSection key={member.name} delay={index * 0.1}>
                <Card className="bg-white/10 backdrop-blur-sm border-0 hover:transform hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <Avatar className="w-20 h-20 mx-auto ring-2 ring-[#D2B48C]">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-center mt-4 text-white">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{member.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest) => (
                        <Badge
                          key={interest}
                          className="bg-[#D2B48C]/20 text-[#D2B48C] px-2 py-1 text-xs inline-flex items-center justify-center"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-[#D2B48C] text-[#D2B48C] hover:bg-[#D2B48C] hover:text-white transition-all duration-300"
                      onClick={() => router.push("/login")}
                    >
                      Join to Connect
                    </Button>
                  </CardFooter>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] py-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2023 GeekedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

