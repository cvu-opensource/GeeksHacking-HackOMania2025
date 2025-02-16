"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:8000"; // Define API URL

export default function Home() {
  const router = useRouter();
  
  const [events, setEvents] = useState([]); 
  const [communityMembers, setCommunityMembers] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${API_URL}/getRandomEvents`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch(`${API_URL}/getRandomProfiles`);
        if (!response.ok) throw new Error("Failed to fetch profiles");
        const data = await response.json();
        setCommunityMembers(data.users || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }
    fetchProfiles();
  }, []);

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

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gradient-to-b from-[#2C3E50] to-[#34495E]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Upcoming Geeky Events</h2>
          {events.length === 0 ? (
            <div className="text-center text-gray-300">Loading events...</div>
          ) : (
            events.map((event, index) => (
              <div key={event.id || index} className="w-full flex-shrink-0 px-4">
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
            ))
          )}
        </div>
      </section>

      {/* Community Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-[#34495E] to-[#2C3E50]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Meet Our Geek Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityMembers.map((member, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-0 hover:transform hover:scale-105 transition-all duration-300">
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
                      <Badge key={interest} className="bg-[#D2B48C]/20 text-[#D2B48C] px-2 py-1 text-xs inline-flex items-center justify-center">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
