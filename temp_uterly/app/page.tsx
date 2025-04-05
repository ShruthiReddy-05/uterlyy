"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { CalendarWeek } from "@/components/calendar-week"
import { CycleProgress } from "@/components/cycle-progress"
import { useTheme } from "@/components/theme-provider-custom"
import { CyclePhase } from "@/types/cycle-phases"
import Image from "next/image"
import { Smile, SmilePlus, Frown, Clock } from "lucide-react"

export default function Dashboard() {
  const { phase, setPhase } = useTheme()
  const [currentDay, setCurrentDay] = useState(5)
  const [selectedMood, setSelectedMood] = useState("sad")
  const [selectedFlow, setSelectedFlow] = useState("medium")

  // For demo purposes, change phase based on UI interaction
  useEffect(() => {
    if (currentDay >= 1 && currentDay <= 5) {
      setPhase(CyclePhase.MENSTRUAL)
    } else if (currentDay >= 6 && currentDay <= 13) {
      setPhase(CyclePhase.FOLLICULAR)
    } else if (currentDay >= 14 && currentDay <= 16) {
      setPhase(CyclePhase.OVULATION)
    } else {
      setPhase(CyclePhase.LUTEAL)
    }
  }, [currentDay, setPhase])

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">HI, USER</h1>
                  <p className="text-lg text-gray-600 mt-1">How are you feeling today?</p>
                </div>
                <div className="bg-[var(--color-lighter)] text-[var(--color-text)] px-4 py-1 rounded-full text-sm">
                  30 March 2025
                </div>
              </div>

              {/* Calendar Week */}
              <div className="flex justify-end">
                <CalendarWeek selectedDate={new Date()} />
              </div>

              {/* Mood Tracker */}
              <div>
                <h2 className="text-lg font-medium mb-3">Mood</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div
                    className={`mood-card ${selectedMood === "happy" ? "active" : ""}`}
                    onClick={() => setSelectedMood("happy")}
                  >
                    <Smile className="w-8 h-8 mb-2" />
                    <span>Happy</span>
                  </div>
                  <div
                    className={`mood-card ${selectedMood === "sad" ? "active" : ""}`}
                    onClick={() => setSelectedMood("sad")}
                  >
                    <Frown className="w-8 h-8 mb-2" />
                    <span>Sad</span>
                  </div>
                  <div
                    className={`mood-card ${selectedMood === "angry" ? "active" : ""}`}
                    onClick={() => setSelectedMood("angry")}
                  >
                    <SmilePlus className="w-8 h-8 mb-2" />
                    <span>Angry</span>
                  </div>
                  <div
                    className={`mood-card ${selectedMood === "tired" ? "active" : ""}`}
                    onClick={() => setSelectedMood("tired")}
                  >
                    <Clock className="w-8 h-8 mb-2" />
                    <span>Tired</span>
                  </div>
                </div>
              </div>

              {/* Flow Tracker */}
              <div>
                <h2 className="text-lg font-medium mb-3">Menstrual Flow</h2>
                <p className="text-sm text-gray-500 mb-3">Your average daily flow</p>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flow-card ${selectedFlow === "light" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("light")}
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-2 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <span>Light</span>
                  </div>
                  <div
                    className={`flow-card ${selectedFlow === "medium" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("medium")}
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-2 h-6 bg-[var(--color-darker)] rounded-full"></div>
                    </div>
                    <span>Medium</span>
                  </div>
                  <div
                    className={`flow-card ${selectedFlow === "heavy" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("heavy")}
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">
                      <div className="w-3 h-7 bg-gray-400 rounded-full"></div>
                    </div>
                    <span>Heavy</span>
                  </div>
                </div>
              </div>

              {/* Featured Resources */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">Featured Resources</h2>
                  <button className="text-sm text-[var(--color-darker)]">See More</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="resource-card">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Luteal Phase"
                      width={100}
                      height={100}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-center">Luteal Phase</p>
                  </div>
                  <div className="resource-card">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Nourish Your Body"
                      width={100}
                      height={100}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-center">Nourish Your Body</p>
                  </div>
                  <div className="resource-card">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Chance of Pregnancy"
                      width={100}
                      height={100}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-center">Chance of Pregnancy</p>
                  </div>
                  <div className="resource-card">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Chance of Pregnancy"
                      width={100}
                      height={100}
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs text-center">Chance of Pregnancy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cycle Progress */}
              <div className="flex justify-center">
                <CycleProgress currentDay={currentDay} cycleLength={28} />
              </div>

              {/* Cycle Info */}
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500">Current Cycle Day</h3>
                  <p className="text-2xl font-medium text-[var(--color-darker)]">Day {currentDay}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Next Period</h3>
                  <p className="text-lg">In 32 days</p>
                </div>
              </div>

              {/* Health Insights */}
              <div className="space-y-3">
                <h2 className="text-lg font-medium">Your Health Insights</h2>

                <div className="health-insight-card flex items-center">
                  <div className="mr-3 text-[var(--color-darker)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Cycle Length</h3>
                    <p className="text-xs text-gray-500">Average: 28 days</p>
                  </div>
                </div>

                <div className="health-insight-card flex items-center">
                  <div className="mr-3 text-[var(--color-darker)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.3 15.2L11 12.3V7H12.5V11.4L17 13.9L16.3 15.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Sleep Pattern</h3>
                    <p className="text-xs text-gray-500">7.5 hours average</p>
                  </div>
                </div>
              </div>

              {/* AI Assistant Button */}
              <button className="btn-primary w-full py-3 flex items-center justify-center">
                Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

