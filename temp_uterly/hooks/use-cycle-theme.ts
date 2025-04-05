"use client"

import { useState, useEffect } from "react"
import { CyclePhase, cycleThemes } from "@/types/cycle-phases"

export function useCycleTheme(currentDay: number, cycleLength = 28) {
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(CyclePhase.MENSTRUAL)

  useEffect(() => {
    // Determine phase based on cycle day
    // Typical phases:
    // Menstrual: days 1-5
    // Follicular: days 6-13
    // Ovulation: days 14-16
    // Luteal: days 17-28

    if (currentDay >= 1 && currentDay <= 5) {
      setCurrentPhase(CyclePhase.MENSTRUAL)
    } else if (currentDay >= 6 && currentDay <= 13) {
      setCurrentPhase(CyclePhase.FOLLICULAR)
    } else if (currentDay >= 14 && currentDay <= 16) {
      setCurrentPhase(CyclePhase.OVULATION)
    } else {
      setCurrentPhase(CyclePhase.LUTEAL)
    }
  }, [currentDay, cycleLength])

  return {
    currentPhase,
    theme: cycleThemes[currentPhase],
  }
}

