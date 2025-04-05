export enum CyclePhase {
  MENSTRUAL = "menstrual",
  FOLLICULAR = "follicular",
  OVULATION = "ovulation",
  LUTEAL = "luteal",
}

export interface ThemeColors {
  darker: string
  lighter: string
  background: string
  text: string
  accent: string
}

export interface CycleTheme {
  name: string
  colors: ThemeColors
}

export const cycleThemes: Record<CyclePhase, CycleTheme> = {
  [CyclePhase.MENSTRUAL]: {
    name: "Menstrual Phase",
    colors: {
      darker: "#F43F5E",
      lighter: "#FFE4E6",
      background: "#FFF1F3",
      text: "#9F1239",
      accent: "#FB7185",
    },
  },
  [CyclePhase.FOLLICULAR]: {
    name: "Follicular Phase",
    colors: {
      darker: "#FAED34",
      lighter: "#FFF6B4",
      background: "#FFFDF0",
      text: "#854D0E",
      accent: "#FDE047",
    },
  },
  [CyclePhase.OVULATION]: {
    name: "Ovulation Phase",
    colors: {
      darker: "#6AD7FF",
      lighter: "#E6F8FF",
      background: "#F0F9FF",
      text: "#075985",
      accent: "#38BDF8",
    },
  },
  [CyclePhase.LUTEAL]: {
    name: "Luteal Phase",
    colors: {
      darker: "#74CF2F",
      lighter: "#DAFBC1",
      background: "#F0FDF4",
      text: "#166534",
      accent: "#86EFAC",
    },
  },
}

