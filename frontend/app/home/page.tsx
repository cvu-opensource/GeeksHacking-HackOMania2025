"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react";
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserMinus, Upload } from "lucide-react"
import { Navigation } from "../components/Navigation"

const API_URL = "http://localhost:8000";

// Mock data for Geekstagram posts
const geekstagramPosts = [
  {
    id: 1,
    user: {
      name: "Alice",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    image: "/placeholder.svg?height=300&width=300",
    caption: "Just finished my latest AI project! #ArtificialIntelligence #MachineLearning",
    likes: 42,
    comments: [
      { user: "Bob", text: "Looks amazing! Can't wait to hear more about it." },
      { user: "Charlie", text: "Great work! What libraries did you use?" },
    ],
  },
  {
    id: 2,
    user: {
      name: "David",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    image: "/placeholder.svg?height=300&width=300",
    caption: "Debugging this code like... 🕵️‍♂️ #CodingLife #DebuggingNightmares",
    likes: 28,
    comments: [
      { user: "Eve", text: "We've all been there! Stay strong 💪" },
      { user: "Frank", text: "Have you tried turning it off and on again? 😉" },
    ],
  },
]

// Mock data for Challenge of the Day
const challengeOfTheDay = {
  title: "Two Sum",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
  ],
  leaderboard: [
    { name: "Alice", runtime: "52 ms", memory: "42.1 MB" },
    { name: "Bob", runtime: "56 ms", memory: "41.8 MB" },
    { name: "Charlie", runtime: "60 ms", memory: "42.3 MB" },
  ],
}

// Mock data for Connect section
const connectUsers = [
  {
    name: "Grace",
    avatar: "https://i.pravatar.cc/150?img=3",
    description: "Full-stack developer with a passion for AI and machine learning.",
    interests: ["AI", "Machine Learning", "Web Development"],
    skills: ["Python", "JavaScript", "React", "TensorFlow"],
  },
  {
    name: "Henry",
    avatar: "https://i.pravatar.cc/150?img=4",
    description: "Cybersecurity enthusiast and ethical hacker. Always looking to learn more about network security.",
    interests: ["Cybersecurity", "Ethical Hacking", "Network Security"],
    skills: ["Penetration Testing", "Wireshark", "Metasploit", "Python"],
  },
  {
    name: "Isabel",
    avatar: "https://i.pravatar.cc/150?img=5",
    description:
      "UX/UI designer with a background in psychology. Passionate about creating intuitive user experiences.",
    interests: ["UX Design", "UI Design", "User Research"],
    skills: ["Figma", "Sketch", "Adobe XD", "User Testing"],
  },
  {
    name: "Jack",
    avatar: "https://i.pravatar.cc/150?img=6",
    description: "Data scientist specializing in natural language processing and sentiment analysis.",
    interests: ["NLP", "Machine Learning", "Big Data"],
    skills: ["Python", "R", "TensorFlow", "NLTK"],
  },
  {
    name: "Karen",
    avatar: "https://i.pravatar.cc/150?img=7",
    description: "DevOps engineer with a focus on cloud infrastructure and automation.",
    interests: ["Cloud Computing", "CI/CD", "Infrastructure as Code"],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
]

// Mock data for current connections
const currentConnections = [
  {
    name: "Liam",
    avatar: "https://i.pravatar.cc/150?img=8",
    description: "Mobile app developer specializing in cross-platform development.",
    interests: ["Mobile Development", "React Native", "Flutter"],
    skills: ["JavaScript", "Dart", "Swift", "Kotlin"],
  },
  {
    name: "Mia",
    avatar: "https://i.pravatar.cc/150?img=9",
    description: "Game developer with a passion for creating immersive VR experiences.",
    interests: ["Game Development", "Virtual Reality", "3D Modeling"],
    skills: ["Unity", "C#", "Blender", "Oculus SDK"],
  },
  {
    name: "Noah",
    avatar: "https://i.pravatar.cc/150?img=10",
    description: "Blockchain developer working on decentralized finance applications.",
    interests: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
    skills: ["Solidity", "Ethereum", "Web3.js", "Truffle"],
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState({ image: null, caption: "" })
  const [posts, setPosts] = useState(geekstagramPosts) // Added posts state
  const fileInputRef = useRef(null)
  const [connectUsersList, setConnectUsersList] = useState([]);
  const [currentConnectionsList, setCurrentConnectionsList] = useState([]);

  useEffect(() => {
    async function fetchConnections() {
        try {
            const res1 = await fetch(`${API_URL}/getFriendRecommendations?username=currentUser`);
            const res2 = await fetch(`${API_URL}/getFriends?username=currentUser`);

            const data1 = await res1.json();
            const data2 = await res2.json();

            setConnectUsersList(data1.recommendations || []);
            setCurrentConnectionsList(data2.friends || []);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    }

    fetchConnections();
}, []);

    const handleAddFriend = async (friend: string) => {
      try {
          await fetch(`${API_URL}/addFriend`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username1: "currentUser", username2: friend }),
          });

          // Refresh the lists after adding a friend
          const updatedFriends = await fetch(`${API_URL}/getFriends?username=currentUser`).then(res => res.json());
          const updatedRecommendations = await fetch(`${API_URL}/getFriendRecommendations?username=currentUser`).then(res => res.json());

          setConnectUsersList(updatedRecommendations.recommendations || []);
          setCurrentConnectionsList(updatedFriends.friends || []);
      } catch (error) {
          console.error("Error adding friend:", error);
      }
    };

    const handleRemoveFriend = async (friend) => {
      try {
          await fetch(`${API_URL}/removeFriend`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username1: "currentUser", username2: friend }),
          });
  
          // Refresh the lists after removing a friend
          const updatedFriends = await fetch(`${API_URL}/getFriends?username=currentUser`).then(res => res.json());
          setCurrentConnectionsList(updatedFriends.friends || []);
      } catch (error) {
          console.error("Error removing friend:", error);
      }
    };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPost({ ...newPost, image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create a new post
    const newPostData = {
      id: posts.length + 1,
      user: {
        name: "Current User", // Replace with actual user name
        avatar: "/placeholder-user.jpg", // Replace with actual user avatar
      },
      image: newPost.image || null, // Allow null for image
      caption: newPost.caption,
      likes: 0,
      comments: [],
    }
    // Add the new post to the posts array
    setPosts([newPostData, ...posts])
    // Reset the form
    setNewPost({ image: null, caption: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <div className="container mx-auto py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Welcome Home!
        </motion.h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="cotd">Challenge of the Day</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="feed">
              <Card className="bg-white/10 backdrop-blur-sm border-0 mb-8">
                <CardHeader>
                  <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-[#D2B48C] text-black hover:bg-[#C1A478]"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      {newPost.image && <span className="text-sm text-gray-500">Image selected</span>}
                    </div>
                    <Textarea
                      placeholder="Write your caption..."
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                    />
                    <Button type="submit" className="bg-[#D2B48C] text-black hover:bg-[#C1A478]">
                      Post
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Feed</CardTitle>
                  <CardDescription>Share and explore tech-related posts from your connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-0 mb-2">
                        <CardHeader className="pb-1 pt-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={post.user.avatar} alt={post.user.name} />
                              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm">{post.user.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-1 pb-2">
                          {post.image && (
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt="Post image"
                              width={300}
                              height={150}
                              className="w-full h-auto rounded-md mb-2"
                            />
                          )}
                          <p className="mb-2 text-xs">{post.caption}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cotd">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge of the Day (COTD)</CardTitle>
                  <CardDescription>Solve the daily coding challenge and compete with others!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{challengeOfTheDay.title}</h3>
                      <p className="mb-4">{challengeOfTheDay.description}</p>
                      <div className="bg-white/10 p-4 rounded-md">
                        <h4 className="font-semibold mb-2">Example:</h4>
                        <p>Input: {challengeOfTheDay.examples[0].input}</p>
                        <p>Output: {challengeOfTheDay.examples[0].output}</p>
                        <p>Explanation: {challengeOfTheDay.examples[0].explanation}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Your Solution</h3>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept=".js,.py,.cpp,.java"
                          className="flex-grow bg-[#D2B48C] text-black hover:bg-[#C1A478] cursor-pointer"
                        />
                        <Button className="bg-[#D2B48C] text-black hover:bg-[#C1A478]">Submit Solution</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-center py-2">Name</th>
                            <th className="text-center py-2">Runtime</th>
                            <th className="text-center py-2">Memory</th>
                          </tr>
                        </thead>
                        <tbody>
                          {challengeOfTheDay.leaderboard.map((entry, index) => (
                            <tr key={index}>
                              <td className="text-center py-2">{entry.name}</td>
                              <td className="text-center py-2">{entry.runtime}</td>
                              <td className="text-center py-2">{entry.memory}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="connect">
              {/* Connect with Fellow Geeks */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect with Fellow Geeks</CardTitle>
                  <CardDescription>Discover and connect with like-minded tech enthusiasts</CardDescription>
                </CardHeader>
                <ScrollArea className="h-[600px] w-full pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {connectUsersList.map((user) => (
                      <Card key={user.name} className="bg-[#D2B48C] text-[#2D3748] h-[500px] flex flex-col">
                        <CardHeader>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-[#2D3748]">{user.name}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                          <div>
                            <p className="mb-4 text-sm text-[#2D3748] h-24 overflow-y-auto">{user.description}</p>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2 text-sm text-[#2D3748]">Interests:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {user.interests.map((interest) => (
                                    <Badge key={interest} variant="secondary" className="text-xs bg-white text-black">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 text-sm text-[#2D3748]">Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {user.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs bg-white text-black">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardFooter className="mt-auto">
                            <Button
                              className="w-full bg-white text-black hover:bg-gray-200"
                              onClick={() => handleAddFriend(user.name)}
                            >
                              Connect
                            </Button>
                          </CardFooter>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Your Connections</CardTitle>
                  <CardDescription>Manage your current connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {currentConnectionsList.map((connection) => (
                        <Card key={connection.name} className="bg-white/10 backdrop-blur-sm border-0">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Link href={`/profile/${connection.name.toLowerCase()}`}>
                                  <Avatar>
                                    <AvatarImage src={connection.avatar} alt={connection.name} />
                                    <AvatarFallback>{connection.name[0]}</AvatarFallback>
                                  </Avatar>
                                </Link>
                                <div>
                                  <Link href={`/profile/${connection.name.toLowerCase()}`}>
                                    <CardTitle className="text-lg hover:underline">{connection.name}</CardTitle>
                                  </Link>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleRemoveFriend(connection.name)}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove Connection
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 text-sm">{connection.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {connection.interests.map((interest) => (
                                <Badge key={interest} variant="secondary" className="text-xs bg-white text-black">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-[#2C3E50] py-8 mt-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2023 GeekedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

