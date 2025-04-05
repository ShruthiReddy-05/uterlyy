"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider-custom"
import { CyclePhase } from "@/types/cycle-phases"
import { Calendar, Clock, Activity, Droplet, Moon, Sun, Heart, Utensils, Zap } from "lucide-react"

// Mock data for insights
const cycleData = {
  averageCycleLength: 28,
  lastCycles: [27, 29, 28, 30, 26, 28],
  currentPhase: CyclePhase.MENSTRUAL,
  currentDay: 5,
  periodLength: 5,
  symptoms: {
    cramps: [5, 4, 3, 2, 1, 0, 0],
    headache: [2, 3, 1, 0, 0, 0, 0],
    bloating: [4, 3, 3, 2, 1, 0, 0],
    mood: [3, 2, 2, 3, 4, 4, 4],
  },
  sleep: {
    averageHours: 7.5,
    quality: [65, 70, 75, 80, 85, 80, 75],
    lastWeek: [7.2, 7.5, 6.8, 8.1, 7.4, 7.9, 7.6],
  },
  nutrition: {
    waterIntake: [6, 7, 8, 7, 6, 8, 7], // in cups
    calorieIntake: [1800, 1950, 2100, 2000, 1850, 1900, 2050],
  },
  activity: {
    steps: [6500, 7200, 8000, 5500, 9000, 7800, 6200],
    workouts: [30, 0, 45, 0, 60, 30, 0], // minutes
  },
}

// Recommendations based on cycle phase
const recommendations = {
  [CyclePhase.MENSTRUAL]: [
    {
      title: "Rest & Recovery",
      description: "Focus on gentle movement like walking or yoga. Your body needs extra rest during this phase.",
      icon: Moon,
    },
    {
      title: "Iron-Rich Foods",
      description: "Include spinach, lentils, and lean red meat to replenish iron lost during menstruation.",
      icon: Utensils,
    },
    {
      title: "Warm Compresses",
      description: "Apply warm compresses to your lower abdomen to help relieve cramps.",
      icon: Droplet,
    },
  ],
  [CyclePhase.FOLLICULAR]: [
    {
      title: "High-Intensity Workouts",
      description:
        "Your energy is increasing - great time for more challenging workouts like HIIT or strength training.",
      icon: Zap,
    },
    {
      title: "Creative Projects",
      description: "Rising estrogen boosts creativity and learning. Start new projects or learn new skills.",
      icon: Sun,
    },
    {
      title: "Antioxidant Foods",
      description: "Consume berries, leafy greens, and nuts to support follicle development.",
      icon: Utensils,
    },
  ],
  [CyclePhase.OVULATION]: [
    {
      title: "Social Activities",
      description: "Your confidence and energy are at their peak. Great time for social gatherings and presentations.",
      icon: Heart,
    },
    {
      title: "Strength Training",
      description: "Take advantage of peak energy levels with challenging strength workouts.",
      icon: Activity,
    },
    {
      title: "Hydration",
      description: "Increase water intake to support cervical fluid production and overall hydration.",
      icon: Droplet,
    },
  ],
  [CyclePhase.LUTEAL]: [
    {
      title: "Mindfulness & Stress Management",
      description: "Practice meditation and stress-reduction techniques as PMS symptoms may appear.",
      icon: Moon,
    },
    {
      title: "Low-Intensity Exercise",
      description: "Switch to gentler exercises like pilates, yoga, or walking as energy decreases.",
      icon: Activity,
    },
    {
      title: "Complex Carbs",
      description: "Include sweet potatoes, brown rice, and oats to help manage cravings and mood swings.",
      icon: Utensils,
    },
  ],
}

export default function InsightsPage() {
  const { phase, colors } = useTheme()
  const [timeframe, setTimeframe] = useState("week")

  // Get recommendations for current phase
  const currentRecommendations = recommendations[phase] || recommendations[CyclePhase.MENSTRUAL]

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Health Insights</h1>
            <p className="text-gray-600">Personalized analysis based on your cycle and health data</p>
          </div>

          {/* Cycle Overview */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">Cycle Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[var(--color-lighter)] rounded-lg p-4 flex items-center">
                <div className="mr-4 p-3 bg-white rounded-full text-[var(--color-darker)]">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Cycle</p>
                  <p className="text-xl font-medium">{cycleData.averageCycleLength} days</p>
                </div>
              </div>

              <div className="bg-[var(--color-lighter)] rounded-lg p-4 flex items-center">
                <div className="mr-4 p-3 bg-white rounded-full text-[var(--color-darker)]">
                  <Droplet size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Period Length</p>
                  <p className="text-xl font-medium">{cycleData.periodLength} days</p>
                </div>
              </div>

              <div className="bg-[var(--color-lighter)] rounded-lg p-4 flex items-center">
                <div className="mr-4 p-3 bg-white rounded-full text-[var(--color-darker)]">
                  <Moon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Phase</p>
                  <p className="text-xl font-medium capitalize">{phase}</p>
                </div>
              </div>

              <div className="bg-[var(--color-lighter)] rounded-lg p-4 flex items-center">
                <div className="mr-4 p-3 bg-white rounded-full text-[var(--color-darker)]">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Day</p>
                  <p className="text-xl font-medium">Day {cycleData.currentDay}</p>
                </div>
              </div>
            </div>

            {/* Cycle Length Chart */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Cycle Length History</h3>
              <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                {cycleData.lastCycles.map((length, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-10 bg-[var(--color-darker)] rounded-t-md"
                      style={{ height: `${(length / 30) * 100}px` }}
                    ></div>
                    <p className="text-xs mt-2">Cycle {index + 1}</p>
                    <p className="text-xs font-medium">{length} days</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Symptoms Tracking */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Symptoms Tracking</h2>

              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm ${timeframe === "week" ? "bg-[var(--color-darker)] text-white" : "bg-white"}`}
                  onClick={() => setTimeframe("week")}
                >
                  Week
                </button>
                <button
                  className={`px-3 py-1 text-sm ${timeframe === "month" ? "bg-[var(--color-darker)] text-white" : "bg-white"}`}
                  onClick={() => setTimeframe("month")}
                >
                  Month
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cramps Chart */}
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium mb-3">Cramps Intensity</h3>
                <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                  {cycleData.symptoms.cramps.map((intensity, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-6 bg-[var(--color-darker)] rounded-t-md"
                        style={{ height: `${(intensity / 5) * 100}px` }}
                      ></div>
                      <p className="text-xs mt-2">Day {index + 1}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span>Severe</span>
                </div>
              </div>

              {/* Mood Chart */}
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium mb-3">Mood Tracking</h3>
                <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                  {cycleData.symptoms.mood.map((mood, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-6 bg-[var(--color-darker)] rounded-t-md"
                        style={{ height: `${(mood / 5) * 100}px` }}
                      ></div>
                      <p className="text-xs mt-2">Day {index + 1}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Sleep */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Sleep Analysis</h2>

              <div className="flex items-center mb-4">
                <div className="mr-4 p-3 bg-[var(--color-lighter)] rounded-full text-[var(--color-darker)]">
                  <Moon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Sleep</p>
                  <p className="text-xl font-medium">{cycleData.sleep.averageHours} hours</p>
                </div>
              </div>

              <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                {cycleData.sleep.lastWeek.map((hours, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-6 bg-[var(--color-darker)] rounded-t-md"
                      style={{ height: `${(hours / 10) * 100}px` }}
                    ></div>
                    <p className="text-xs mt-2">Day {index + 1}</p>
                    <p className="text-xs font-medium">{hours}h</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Activity Tracking</h2>

              <div className="flex items-center mb-4">
                <div className="mr-4 p-3 bg-[var(--color-lighter)] rounded-full text-[var(--color-darker)]">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Steps</p>
                  <p className="text-xl font-medium">
                    {Math.round(
                      cycleData.activity.steps.reduce((a, b) => a + b, 0) / cycleData.activity.steps.length,
                    ).toLocaleString()}{" "}
                    avg
                  </p>
                </div>
              </div>

              <div className="h-40 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
                {cycleData.activity.steps.map((steps, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-6 bg-[var(--color-darker)] rounded-t-md"
                      style={{ height: `${(steps / 10000) * 100}px` }}
                    ></div>
                    <p className="text-xs mt-2">Day {index + 1}</p>
                    <p className="text-xs font-medium">{(steps / 1000).toFixed(1)}k</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">
              Recommendations for {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-5 hover:shadow-md transition-all">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-[var(--color-lighter)] rounded-full text-[var(--color-darker)] mr-3">
                      <rec.icon size={24} />
                    </div>
                    <h3 className="text-lg font-medium">{rec.title}</h3>
                  </div>
                  <p className="text-gray-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

