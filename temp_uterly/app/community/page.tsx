"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider-custom"
import Image from "next/image"
import { Search, MessageSquare, Heart, Share2, ArrowUp, ArrowDown, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for community posts
const communityPosts = [
  {
    id: 1,
    title: "How do you manage period cramps naturally?",
    content:
      "I've been experiencing really bad cramps lately and I'm looking for natural remedies that have worked for others. I've tried heating pads but looking for more options!",
    author: "Emma_J",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Period Health",
    upvotes: 45,
    downvotes: 2,
    comments: 23,
    timePosted: "2 hours ago",
    tags: ["cramps", "natural remedies", "period health"],
  },
  {
    id: 2,
    title: "Success with PCOS management - My journey",
    content:
      "After struggling with PCOS for 5 years, I've finally found a routine that works for me. Wanted to share my experience with diet changes, supplements, and exercise that have helped regulate my cycles.",
    author: "Sarah_wellness",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "PCOS",
    upvotes: 128,
    downvotes: 3,
    comments: 56,
    timePosted: "1 day ago",
    tags: ["PCOS", "success story", "hormonal health"],
  },
  {
    id: 3,
    title: "Fertility tracking apps comparison",
    content:
      "I've tried several fertility tracking apps over the past year and wanted to share my thoughts on the pros and cons of each one. Has anyone else found one that's particularly accurate?",
    author: "FutureMom32",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Fertility",
    upvotes: 87,
    downvotes: 5,
    comments: 42,
    timePosted: "3 days ago",
    tags: ["fertility", "apps", "tracking"],
  },
  {
    id: 4,
    title: "Mental health during luteal phase - tips?",
    content:
      "Every month I struggle with anxiety and mood swings during my luteal phase. What strategies have worked for you to manage these symptoms?",
    author: "MindfulCycler",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Mental Health",
    upvotes: 76,
    downvotes: 1,
    comments: 38,
    timePosted: "5 days ago",
    tags: ["mental health", "luteal phase", "anxiety", "PMS"],
  },
]

// Categories for filter
const categories = [
  "All Topics",
  "Period Health",
  "PCOS",
  "Fertility",
  "Mental Health",
  "Pregnancy",
  "Menopause",
  "Sexual Health",
]

export default function CommunityPage() {
  const { colors } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Topics")
  const [sortBy, setSortBy] = useState("popular")

  // Filter posts based on search and filters
  const filteredPosts = communityPosts.filter((post) => {
    // Filter by search term
    if (
      searchTerm &&
      !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "All Topics" && post.category !== selectedCategory) {
      return false
    }

    return true
  })

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.upvotes - a.upvotes
    } else if (sortBy === "recent") {
      // This is a simplified sort - in a real app, you'd compare actual dates
      return a.timePosted.includes("hour") ? -1 : 1
    } else if (sortBy === "discussed") {
      return b.comments - a.comments
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community</h1>
              <p className="text-gray-600">Connect with others on their women's health journey</p>
            </div>

            <button className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              <span>New Post</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search discussions"
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <select
                  className="w-full p-3 border rounded-lg bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${sortBy === "popular" ? "bg-[var(--color-darker)] text-white" : "border"}`}
                  onClick={() => setSortBy("popular")}
                >
                  Popular
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${sortBy === "recent" ? "bg-[var(--color-darker)] text-white" : "border"}`}
                  onClick={() => setSortBy("recent")}
                >
                  Recent
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${sortBy === "discussed" ? "bg-[var(--color-darker)] text-white" : "border"}`}
                  onClick={() => setSortBy("discussed")}
                >
                  Most Discussed
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {sortedPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found matching your criteria</p>
              </div>
            ) : (
              sortedPosts.map((post) => (
                <div key={post.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center">
                      <button className="text-gray-400 hover:text-[var(--color-darker)]">
                        <ArrowUp size={20} />
                      </button>
                      <span className="my-1 font-medium">{post.upvotes - post.downvotes}</span>
                      <button className="text-gray-400 hover:text-[var(--color-darker)]">
                        <ArrowDown size={20} />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[var(--color-lighter)] text-[var(--color-text)] rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">• {post.timePosted}</span>
                      </div>

                      <Link href={`/community/${post.id}`} className="block">
                        <h2 className="text-xl font-medium mb-2 hover:text-[var(--color-darker)]">{post.title}</h2>
                        <p className="text-gray-700 mb-4 line-clamp-2">{post.content}</p>
                      </Link>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={post.authorAvatar || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[var(--color-darker)]">
                            <MessageSquare size={18} />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[var(--color-darker)]">
                            <Heart size={18} />
                            <span className="text-sm">Save</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-[var(--color-darker)]">
                            <Share2 size={18} />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

