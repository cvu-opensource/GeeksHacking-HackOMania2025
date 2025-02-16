"use client"

import type React from "react"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, PlusCircle, Search } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Navigation } from "../components/Navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = "http://127.0.0.1:8000";

// Mock data for forum posts
const initialPosts = [
  {
    id: 1,
    title: "How to implement a binary search tree in Python?",
    content:
      "I'm struggling with implementing a binary search tree in Python. Can someone provide an example or explain the basic structure?",
    author: "pythonLearner",
    date: "2023-05-15",
    comments: [
      { id: 1, author: "pythonExpert", content: "Here's a basic implementation:", date: "2023-05-15" },
      { id: 2, author: "algorithmLover", content: "Don't forget to handle edge cases!", date: "2023-05-16" },
    ],
    tags: ["python", "data-structures", "algorithms"],
    code: `
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    # Need help with insert and search methods
    `,
  },
  {
    id: 2,
    title: "Best practices for React state management in 2023",
    content:
      "With so many options available (Redux, MobX, Recoil, Zustand), what are the current best practices for state management in React applications?",
    author: "reactDeveloper",
    date: "2023-05-14",
    comments: [
      {
        id: 1,
        author: "reduxFan",
        content: "Redux is still a solid choice for large applications.",
        date: "2023-05-14",
      },
      {
        id: 2,
        author: "hooksMaster",
        content: "For smaller apps, React's built-in hooks might be sufficient.",
        date: "2023-05-15",
      },
    ],
    tags: ["react", "state-management", "frontend"],
  },
]

export default function Forums() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_URL}/getPostRecommendations?username=currentUser`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Failed to fetch posts");
  
        const data = await response.json();
        setPosts(data.posts || []); // Ensure posts are correctly set
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  
    fetchPosts();
  }, []);

  const [newPost, setNewPost] = useState({ title: "", content: "", code: "", tags: "", isAnonymous: false })
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPostObj = {
      id: posts.length + 1,
      ...newPost,
      author: newPost.isAnonymous ? "Anonymous" : "CurrentUser", // Replace with actual user logic
      date: new Date().toISOString().split("T")[0],
      comments: [],
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
    }
    setPosts([newPostObj, ...posts])
    setNewPost({ title: "", content: "", code: "", tags: "", isAnonymous: false })
  }

  const handleAddComment = () => {
    if (newComment && selectedPost) {
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  author: "CurrentUser",
                  content: newComment,
                  date: new Date().toISOString().split("T")[0],
                },
              ],
            }
          : post,
      )
      setPosts(updatedPosts)
      setNewComment("")
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault();
  
    const formattedEvent = {
      eventid: Math.floor(Math.random() * 10000), // Generate random ID if not provided
      event_name: newEvent.title,
      event_description: newEvent.description,
      event_url: newEvent.url,
      event_logo: newEvent.logo || "/placeholder.svg",
      starttime_local: `${newEvent.startDate}T${newEvent.startTime}`,
      endtime_local: `${newEvent.endDate}T${newEvent.endTime}`,
      is_free: newEvent.isFree ? "true" : "false",
      is_online: newEvent.isOnline ? "true" : "false",
      category: newEvent.type,
      venue_location: newEvent.location,
      organizer_name: newEvent.organizer,
      organizer_website: newEvent.organizerWebsite,
    };
  
    try {
      const response = await fetch(`${API_URL}/addEvents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedEvent),
      });
  
      if (!response.ok) throw new Error("Failed to add event");
  
      alert("Event added successfully!");
      setShowAddEventDialog(false);
  
      // Refresh event list
      const updatedEvents = await fetch(`${API_URL}/getEventRecommendations?username=currentUser`).then(res => res.json());
      setEvents(updatedEvents.recommendations || []);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };
  
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
});

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#2D3748]">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">GeeksConnect Forums</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#48BB78] hover:bg-[#48BB78]/80 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogDescription>Share your question or start a discussion with the community.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="title" value={newPost.title} onChange={handleInputChange} placeholder="Title" required />
                <Textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  placeholder="Content"
                  required
                />
                <Textarea name="code" value={newPost.code} onChange={handleInputChange} placeholder="Code (optional)" />
                <Input
                  name="tags"
                  value={newPost.tags}
                  onChange={handleInputChange}
                  placeholder="Tags (comma-separated)"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
                  />
                  <label htmlFor="isAnonymous">Post anonymously</label>
                </div>
                <Button type="submit">Create Post</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSelectedTag("")} className="ml-2">
            Clear Tags
          </Button>
        </div>

        {/* Forum Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="w-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className="text-xl hover:text-[#48BB78] cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-[#4A5568]">
                      Posted by {post.author} on {post.date}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                {post.code && (
                  <div className="mb-4 bg-[#1E1E1E] rounded-md overflow-hidden">
                    <SyntaxHighlighter language="python" style={tomorrow}>
                      {post.code}
                    </SyntaxHighlighter>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-[#D2B48C] text-[#2D3748]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPost(post)}
                  className="text-[#48BB78] hover:text-[#48BB78]/80"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {post.comments.length} Comments
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Full-screen post view */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <Button variant="ghost" onClick={() => setSelectedPost(null)}>
                  Close
                </Button>
              </div>
              <p className="mb-4">{selectedPost.content}</p>
              {selectedPost.code && (
                <div className="mb-4 bg-[#1E1E1E] rounded-md overflow-hidden">
                  <SyntaxHighlighter language="python" style={tomorrow}>
                    {selectedPost.code}
                  </SyntaxHighlighter>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#D2B48C] text-[#2D3748]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-2">Comments</h3>
              <div className="space-y-4 mb-4">
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-semibold">{comment.author}</p>
                    <p>{comment.content}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#D2B48C] py-8 mt-8">
        <div className="container mx-auto text-center text-[#2D3748]">
          <p>&copy; 2023 GeeksConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

