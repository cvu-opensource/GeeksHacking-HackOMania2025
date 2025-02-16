"use client"

import type { NextPage } from "next"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Users, DollarSign, ChevronDown, ChevronUp, Search, Upload } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation } from "../components/Navigation"

const API_URL = "http://localhost:8000";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("./Map").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

// Mock data for events (updated with Singapore locations)
const initialEvents = [];

const eventTypes = ["Hackathon", "Workshop", "Networking", "Lecture", "Tutorial", "Codefest"]
const interests = [
  "AI",
  "Machine Learning",
  "Web Development",
  "Cybersecurity",
  "Data Science",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "Blockchain",
  "IoT",
]

const Events: NextPage = () => {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  useEffect(() => {
    async function fetchEvents() {
        try {
            const response = await fetch(`${API_URL}/getEventRecommendations`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
            if (!response.ok) throw new Error("Failed to fetch events");
            const data = await response.json();
            setEvents(data.recommendations || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    fetchEvents();
}, []);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    type: "",
    location: "",
    topic: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const searchRef = useRef(null)
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    url: "",
    logo: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isFree: false, // Updated: isFree is now false by default
    isOnline: false,
    type: "",
    location: "",
    organizer: "",
    organizerWebsite: "",
    cost: 0,
    attendees: 0,
    interests: [],
    experienceLevel: "",
    prerequisites: "",
    requirements: "",
    preparation: "",
    coordinates: [0, 0],
    postalCode: "",
  })
  const logoInputRef = useRef(null)

  const filteredEvents = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filters.dateRange.start || new Date(event.startDate) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end || new Date(event.endDate) <= new Date(filters.dateRange.end)) &&
      (!filters.type || event.type === filters.type) &&
      (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.topic || event.interests.includes(filters.topic))
    )
  })

  const recommendedEvents = events.slice(0, 3) // In a real app, this would be based on user preferences

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setSearchResults(results.slice(0, 5)) // Limit to 5 results
    } else {
      setSearchResults([])
    }
  }, [searchTerm, events])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewEvent({ ...newEvent, logo: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault();

    // Ensure API request body follows correct structure
    const eventPayload = {
      eventid: 0,  // API requires this, default to 0
      event_name: newEvent.title || "",
      event_description: newEvent.description || "",
      event_url: newEvent.url || "",
      event_logo: newEvent.logo || "", // Ensure valid image URL or empty string
      starttime_local: `${newEvent.startDate}T${newEvent.startTime}:00Z`,  // Ensure correct time format
      endtime_local: `${newEvent.endDate}T${newEvent.endTime}:00Z`,
      is_free: newEvent.isFree ? "true" : "false", // Convert to expected string format
      is_online: newEvent.isOnline ? "true" : "false",
      category: newEvent.type || "",
      venue_location: newEvent.location || "",
      organizer_name: newEvent.organizer || "",
      organizer_website: newEvent.organizerWebsite || ""
  };

  console.log("Submitting event:", eventPayload); // Debugging output

    try {
        const response = await fetch(`${API_URL}/addEvents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventPayload),
        });

        if (!response.ok) throw new Error("Failed to add event");

        alert("Event added successfully!");
        setShowAddEventDialog(false);

        // Refresh events list after adding new event
        const updatedEvents = await fetch(`${API_URL}/getEventRecommendations`).then(res => res.json());
        setEvents(updatedEvents.recommendations || []);
    } catch (error) {
        console.error("Error adding event:", error);
    }
};

  const clearFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      type: "",
      location: "",
      topic: "",
    })
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#2D3748]">
      <Navigation />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Events</h1>

        {/* Top Section: Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-[#D2B48C] focus:border-[#48BB78] transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-[#D2B48C] hover:bg-[#C1A478] text-[#2D3748] transition-colors duration-200"
              >
                {showFilters ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show Filters
                  </>
                )}
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${
                showFilters ? "animate-filter-slide-down" : "animate-filter-slide-up"
              }`}
            >
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger id="eventType" className="w-full">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Types</SelectItem>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={filters.topic} onValueChange={(value) => setFilters({ ...filters, topic: value })}>
                  <SelectTrigger id="topic" className="w-full">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Topics</SelectItem>
                    {interests.sort().map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Button */}
        <Button
          onClick={() => setShowAddEventDialog(true)}
          className="mb-8 bg-[#48BB78] hover:bg-[#48BB78]/80 text-white"
        >
          Add New Event
        </Button>

        {/* Main Content: Left (Events) and Right (Map) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section: Events */}
          <div className="w-full lg:w-1/2 xl:w-3/5">
            {/* Recommended Events */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <CardHeader>
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="rounded-t-lg"
                      />
                      <CardTitle className="mt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {event.startDate} - {event.endDate} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => router.push("/signup")}
                        className="w-full bg-[#4299E1] hover:bg-[#4299E1]/80 text-white transition-colors duration-200"
                      >
                        Sign Up
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Event Categories */}
            {eventTypes.map((type) => {
              const eventsOfType = filteredEvents.filter((event) => event.type === type)
              if (eventsOfType.length === 0) return null
              return (
                <section key={type} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">{type}s</h2>
                  <div className="flex overflow-x-auto space-x-4 pb-4">
                    {eventsOfType.map((event) => (
                      <Card
                        key={event.id}
                        className="flex-shrink-0 w-64 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        <CardHeader>
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            width={200}
                            height={100}
                            className="rounded-t-lg"
                          />
                          <CardTitle className="mt-2 text-lg">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {event.startDate} - {event.endDate}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.location}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => router.push("/signup")}
                            className="w-full bg-[#4299E1] hover:bg-[#4299E1]/80 text-white transition-colors duration-200"
                          >
                            Sign Up
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Right Section: Map */}
          <div className="w-full lg:w-1/2 xl:w-2/5 h-[calc(100vh-200px)] sticky top-24">
            <Map events={filteredEvents} hoveredEvent={hoveredEvent} setSelectedEvent={setSelectedEvent} />
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#2D3748]">{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <Image
                src={selectedEvent.image || "/placeholder.svg"}
                alt={selectedEvent.title}
                width={600}
                height={300}
                className="rounded-lg"
              />
              <p className="text-lg font-semibold text-[#4A5568]">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-[#4A5568]">
                  <CalendarIcon className="mr-2 h-5 w-5 text-[#48BB78]" />
                  {selectedEvent.startDate} - {selectedEvent.endDate} at {selectedEvent.time}
                </div>
                <div className="flex items-center text-[#4A5568]">
                  < Pin className="mr-2 h-5 w-5 text-[#48BB78]" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center text-[#4A5568]">
                  <Users className="mr-2 h-5 w-5 text-[#48BB78]" />
                  {selectedEvent.attendees} attendees
                </div>
                <div className="flex items-center text-[#4A5568]">
                  <DollarSign className="mr-2 h-5 w-5 text-[#48BB78]" />
                  {selectedEvent.cost > 0 ? `$${selectedEvent.cost}` : "Free"}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#2D3748]">Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.interests.map((topic) => (
                    <Badge key={topic} variant="secondary" className="bg-[#D2B48C] text-[#2D3748]">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#2D3748]">Prerequisites:</h3>
                <p className="text-[#4A5568]">{selectedEvent.prerequisites}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#2D3748]">Requirements:</h3>
                <p className="text-[#4A5568]">{selectedEvent.requirements}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#2D3748]">Preparation:</h3>
                <p className="text-[#4A5568]">{selectedEvent.preparation}</p>
              </div>
              <Button
                className="w-full bg-[#48BB78] hover:bg-[#48BB78]/80 text-white transition-colors duration-200"
                onClick={() => router.push("/signup")}
              >
                Sign Up for Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Name</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Event URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={newEvent.url}
                  onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Event Logo</Label>
                <div className="flex items-center space-x-4">
                  <Button type="button" onClick={() => logoInputRef.current.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  {newEvent.logo && <span className="text-sm text-gray-500">Logo uploaded</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
              <Label htmlFor="isFree" className="text-white">Free Event</Label>
              <Switch
                id="isFree"
                checked={newEvent.isFree}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, isFree: checked })}
                className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400 transition-all duration-200
                          peer-checked:bg-[#D2B48C] bg-transparent"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-5" />
              </Switch>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="isOnline" className="text-white">Online Event</Label>
              <Switch
                id="isOnline"
                checked={newEvent.isOnline}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, isOnline: checked })}
                className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400 transition-all duration-200
                          peer-checked:bg-[#D2B48C] bg-transparent"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-5" />
              </Switch>
            </div>

              <div className="space-y-2">
            <Label htmlFor="type">Category</Label>
            <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-800">
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type} className="bg-white text-gray-800 hover:bg-gray-200">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
  <Label htmlFor="interests">Interests</Label>
  <Select
    onValueChange={(value) => {
      if (!newEvent.interests.includes(value)) {
        setNewEvent({ ...newEvent, interests: [...newEvent.interests, value] }); // ✅ Append instead of replacing
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select interests" />
    </SelectTrigger>
    <SelectContent className="bg-white text-gray-800">
      {interests
        .filter((interest) => !newEvent.interests.includes(interest))
        .map((interest) => (
          <SelectItem key={interest} value={interest} className="hover:bg-gray-200">
            {interest}
          </SelectItem>
        ))}
    </SelectContent>
  </Select>

  {/* Display Selected Interests */}
  <div className="flex flex-wrap gap-2 mt-2">
    {newEvent.interests.map((interest) => (
      <Badge key={interest} variant="secondary" className="bg-[#D2B48C] text-[#2D3748]">
        {interest}
        <button
          className="ml-1 text-xs"
          onClick={() =>
            setNewEvent({
              ...newEvent,
              interests: newEvent.interests.filter((i) => i !== interest), // ✅ Remove interest when clicked
            })
          }
        >
          ×
        </button>
      </Badge>
    ))}
  </div>
</div>
              <div className="space-y-2">
                <Label htmlFor="location">Venue</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizerWebsite">Organizer Website</Label>
                <Input
                  id="organizerWebsite"
                  type="url"
                  value={newEvent.organizerWebsite}
                  onChange={(e) => setNewEvent({ ...newEvent, organizerWebsite: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-[#48BB78] hover:bg-[#48BB78]/80 text-white">
                Add Event
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-[#D2B48C] py-8 mt-8">
        <div className="container mx-auto text-center text-[#2D3748]">
          <p>&copy; 2023 GeeksConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Events

