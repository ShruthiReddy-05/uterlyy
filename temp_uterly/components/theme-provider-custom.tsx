"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { CyclePhase, cycleThemes, type ThemeColors } from "@/types/cycle-phases"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultPhase?: CyclePhase
}

type ThemeContextType = {
  phase: CyclePhase
  setPhase: (phase: CyclePhase) => void
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProviderCustom({ children, defaultPhase = CyclePhase.MENSTRUAL }: ThemeProviderProps) {
  const [phase, setPhase] = useState<CyclePhase>(defaultPhase)
  const [colors, setColors] = useState<ThemeColors>(cycleThemes[defaultPhase].colors)

  useEffect(() => {
    setColors(cycleThemes[phase].colors)

    // Apply CSS variables to :root
    const root = document.documentElement
    root.style.setProperty("--color-darker", cycleThemes[phase].colors.darker)
    root.style.setProperty("--color-lighter", cycleThemes[phase].colors.lighter)
    root.style.setProperty("--color-background", cycleThemes[phase].colors.background)
    root.style.setProperty("--color-text", cycleThemes[phase].colors.text)
    root.style.setProperty("--color-accent", cycleThemes[phase].colors.accent)
  }, [phase])

  return <ThemeContext.Provider value={{ phase, setPhase, colors }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

