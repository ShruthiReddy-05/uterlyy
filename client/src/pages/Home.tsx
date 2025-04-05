import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Smile, Frown, SmilePlus, Clock, Droplet } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { CalendarWeek } from "../components/CalendarWeek";
import { CycleProgress } from "../components/CycleProgress";
import { useTheme } from "../components/ThemeProviderCustom";
import { CyclePhase } from "../types/cycle-phases";
import { Chatbot } from "../components/Chatbot";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { phase, setPhase } = useTheme();
  const [currentDay, setCurrentDay] = useState(5);
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [selectedFlow, setSelectedFlow] = useState<string>("medium");
  
  // For demo purposes, change phase based on UI interaction
  useEffect(() => {
    if (currentDay >= 1 && currentDay <= 5) {
      setPhase(CyclePhase.MENSTRUAL);
    } else if (currentDay >= 6 && currentDay <= 13) {
      setPhase(CyclePhase.FOLLICULAR);
    } else if (currentDay >= 14 && currentDay <= 16) {
      setPhase(CyclePhase.OVULATION);
    } else {
      setPhase(CyclePhase.LUTEAL);
    }
  }, [currentDay, setPhase]);

  // Fetch cycle data
  const { data: cycles } = useQuery({
    queryKey: ['/api/cycles'],
  });

  // Fetch period logs
  const { data: logs } = useQuery({
    queryKey: ['/api/period-logs'],
  });

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Chatbot initialOpen={false} />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">Hello!</h1>
                  <p className="text-lg text-gray-600 mt-1">How are you feeling today?</p>
                </div>
                <div className="bg-[var(--color-lighter)] text-[var(--color-text)] px-4 py-1 rounded-full text-sm">
                  {format(new Date(), 'd MMMM yyyy')}
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
                    className={`mood-card ${selectedMood === "energetic" ? "active" : ""}`}
                    onClick={() => setSelectedMood("energetic")}
                  >
                    <SmilePlus className="w-8 h-8 mb-2" />
                    <span>Energetic</span>
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
                <p className="text-sm text-gray-500 mb-3">Your daily flow intensity</p>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flow-card ${selectedFlow === "light" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("light")}
                  >
                    <Droplet className="w-8 h-8 mb-2 opacity-30" />
                    <span>Light</span>
                  </div>
                  <div
                    className={`flow-card ${selectedFlow === "medium" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("medium")}
                  >
                    <Droplet className="w-8 h-8 mb-2 opacity-60" />
                    <span>Medium</span>
                  </div>
                  <div
                    className={`flow-card ${selectedFlow === "heavy" ? "active" : ""}`}
                    onClick={() => setSelectedFlow("heavy")}
                  >
                    <Droplet className="w-8 h-8 mb-2 opacity-100" />
                    <span>Heavy</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">Save today's log</button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cycle Progress */}
              <div className="p-6 rounded-lg shadow-sm bg-white border" style={{ borderColor: 'var(--color-lighter)' }}>
                <h2 className="text-lg font-medium mb-4">Cycle Day</h2>
                <div className="flex justify-center">
                  <CycleProgress currentDay={currentDay} cycleLength={28} />
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">Next period in</p>
                  <p className="text-lg">{28 - currentDay} days</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                    className="btn-outline flex-1"
                  >
                    Previous Day
                  </button>
                  <button 
                    onClick={() => setCurrentDay(Math.min(28, currentDay + 1))}
                    className="btn-primary flex-1"
                  >
                    Next Day
                  </button>
                </div>
              </div>

              {/* Phase Info */}
              <div className="p-6 rounded-lg shadow-sm bg-white border" style={{ borderColor: 'var(--color-lighter)' }}>
                <h2 className="text-lg font-medium mb-2">
                  {phase === CyclePhase.MENSTRUAL && "Menstrual Phase"}
                  {phase === CyclePhase.FOLLICULAR && "Follicular Phase"}
                  {phase === CyclePhase.OVULATION && "Ovulation Phase"}
                  {phase === CyclePhase.LUTEAL && "Luteal Phase"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {phase === CyclePhase.MENSTRUAL && "Your period is happening now. This phase typically lasts 3-7 days."}
                  {phase === CyclePhase.FOLLICULAR && "Your body is preparing for ovulation. This phase typically lasts 7-10 days."}
                  {phase === CyclePhase.OVULATION && "You're at your most fertile. This phase typically lasts 3-5 days."}
                  {phase === CyclePhase.LUTEAL && "Your body is preparing for your next period. This phase typically lasts 10-14 days."}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Energy</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full"
                        style={{ 
                          width: phase === CyclePhase.MENSTRUAL ? '25%' : 
                                 phase === CyclePhase.FOLLICULAR ? '75%' : 
                                 phase === CyclePhase.OVULATION ? '100%' : '50%',
                          backgroundColor: 'var(--color-darker)'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mood</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full"
                        style={{ 
                          width: phase === CyclePhase.MENSTRUAL ? '30%' : 
                                 phase === CyclePhase.FOLLICULAR ? '70%' : 
                                 phase === CyclePhase.OVULATION ? '90%' : '40%',
                          backgroundColor: 'var(--color-darker)'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Focus</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full"
                        style={{ 
                          width: phase === CyclePhase.MENSTRUAL ? '40%' : 
                                 phase === CyclePhase.FOLLICULAR ? '60%' : 
                                 phase === CyclePhase.OVULATION ? '70%' : '85%',
                          backgroundColor: 'var(--color-darker)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
