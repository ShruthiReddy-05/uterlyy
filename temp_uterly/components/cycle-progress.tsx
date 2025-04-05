"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider-custom"
import { CyclePhase } from "@/types/cycle-phases"

interface CycleProgressProps {
  currentDay: number
  cycleLength: number
}

export function CycleProgress({ currentDay, cycleLength }: CycleProgressProps) {
  const { phase } = useTheme()
  const [emoji, setEmoji] = useState("😊")

  useEffect(() => {
    // Set emoji based on phase
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        setEmoji("😣")
        break
      case CyclePhase.FOLLICULAR:
        setEmoji("😊")
        break
      case CyclePhase.OVULATION:
        setEmoji("🥰")
        break
      case CyclePhase.LUTEAL:
        setEmoji("😌")
        break
    }
  }, [phase])

  // Calculate progress percentage
  const progress = (currentDay / cycleLength) * 100

  // Generate SVG path for progress circle
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Generate colors for different segments
  const getSegmentColor = (segmentPhase: CyclePhase) => {
    switch (segmentPhase) {
      case CyclePhase.MENSTRUAL:
        return "#F43F5E"
      case CyclePhase.FOLLICULAR:
        return "#FAED34"
      case CyclePhase.OVULATION:
        return "#6AD7FF"
      case CyclePhase.LUTEAL:
        return "#74CF2F"
    }
  }

  return (
    <div className="cycle-progress">
      <svg width="150" height="150" viewBox="0 0 150 150">
        {/* Background circle */}
        <circle cx="75" cy="75" r="70" fill="none" stroke="#f0f0f0" strokeWidth="8" />

        {/* Menstrual phase (days 1-5) */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="none"
          stroke={getSegmentColor(CyclePhase.MENSTRUAL)}
          strokeWidth="8"
          strokeDasharray={`${(5 / cycleLength) * circumference} ${circumference}`}
          strokeDashoffset="0"
          transform="rotate(-90 75 75)"
        />

        {/* Follicular phase (days 6-13) */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="none"
          stroke={getSegmentColor(CyclePhase.FOLLICULAR)}
          strokeWidth="8"
          strokeDasharray={`${(8 / cycleLength) * circumference} ${circumference}`}
          strokeDashoffset={`${(1 - 5 / cycleLength) * circumference}`}
          transform="rotate(-90 75 75)"
        />

        {/* Ovulation phase (days 14-16) */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="none"
          stroke={getSegmentColor(CyclePhase.OVULATION)}
          strokeWidth="8"
          strokeDasharray={`${(3 / cycleLength) * circumference} ${circumference}`}
          strokeDashoffset={`${(1 - 13 / cycleLength) * circumference}`}
          transform="rotate(-90 75 75)"
        />

        {/* Luteal phase (days 17-28) */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="none"
          stroke={getSegmentColor(CyclePhase.LUTEAL)}
          strokeWidth="8"
          strokeDasharray={`${(12 / cycleLength) * circumference} ${circumference}`}
          strokeDashoffset={`${(1 - 16 / cycleLength) * circumference}`}
          transform="rotate(-90 75 75)"
        />

        {/* Current progress indicator */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray={`5 ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 75 75)"
        />
      </svg>

      <div className="cycle-day">
        <div className="text-sm font-medium text-gray-500">DAY {currentDay}</div>
        <div className="text-3xl mt-1">{emoji}</div>
      </div>
    </div>
  )
}

