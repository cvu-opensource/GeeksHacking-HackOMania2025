"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:8000"; // Define API URL

export default function Home() {
  const router = useRouter();
  
  const [events, setEvents] = useState([]); 
  const [communityMembers, setCommunityMembers] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${API_URL}/getRandomEvents`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
      
        const formattedEvents = data.data.events.map(event => ({
          id: event.eventid, 
          title: event.name, 
          image: event.logo || "/placeholder.svg", 
          location: event.venue_address, 
          date: event.starttime_local.split("T")[0], 
          time: event.starttime_local.split("T")[1], 
          attendees: event.attendees || "N/A", 
          cost: event.is_free ? "Free" : "Paid", 
          description: event.description, 
        }));

        setEvents(formattedEvents);
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
        
        const formattedProfiles = data.data.users.map(user => ({
          name: user.username, 
          description: user.about_me || "No description available", 
          avatar: `https://i.pravatar.cc/150?u=${user.username}`, 
          interests: user.interests || ["No interests listed"], 
        }));

        setCommunityMembers(formattedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }
    fetchProfiles();
  }, []);

  // Auto-scroll functionality for event carousel
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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

      {/* Welcome Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-extrabold text-white">Welcome to GeekedIn</h1>
        <p className="text-xl text-gray-300 mt-4">A place where geeks unite, collaborate, and grow.</p>
        <Button className="mt-6 bg-[#FF6B6B] hover:bg-[#FF6B6B]/80" onClick={() => router.push("/login")}>
          Join Now
        </Button>
      </section>

      {/* Upcoming Events Section with Auto-Scroll */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Upcoming Geeky Events</h2>
          <div className="relative flex items-center">
            <Button className="absolute left-0 z-10 bg-[#D2B48C]" onClick={scrollLeft}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div ref={scrollRef} className="flex space-x-6 overflow-x-auto scroll-smooth px-4">
              {events.length === 0 ? (
                <div className="text-center text-gray-300">Loading events...</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="flex-shrink-0 w-[300px]">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/10 backdrop-blur-sm border-0">
                      <Image src={event.image} alt={event.title} width={300} height={150} className="h-[150px] w-full object-cover" />
                      <CardHeader>
                        <CardTitle className="text-xl text-white">{event.title}</CardTitle>
                        <CardDescription className="text-gray-300">{event.date} at {event.time}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-white">{event.location}</p>
                        <p className="text-sm text-gray-300">{event.attendees} attendees • {event.cost}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/80 text-white" onClick={() => router.push("/login")}>
                          Sign Up
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              )}
            </div>
            <Button className="absolute right-0 z-10 bg-[#D2B48C]" onClick={scrollRight}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Community Showcase Section */}
      <section className="py-16">
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
                  <p className="text-sm text-gray-300 mb-4">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
