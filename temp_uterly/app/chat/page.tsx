"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider-custom"
import { Send, Paperclip, Mic, Image } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// Predefined bot responses based on common women's health questions
const botResponses: Record<string, string[]> = {
  period: [
    "Menstrual cycles typically range from 21 to 35 days, with the average being 28 days. Bleeding usually lasts 3-7 days.",
    "Period pain (dysmenorrhea) is caused by prostaglandins, which make the uterus contract. Over-the-counter pain relievers, heat therapy, and gentle exercise can help manage cramps.",
    "Irregular periods can be caused by stress, significant weight changes, excessive exercise, hormonal imbalances, or conditions like PCOS. If you're concerned about irregularity, it's best to consult with your healthcare provider.",
  ],
  pms: [
    "PMS symptoms typically occur 1-2 weeks before your period starts. Common symptoms include mood swings, breast tenderness, bloating, and food cravings.",
    "To manage PMS symptoms, try regular exercise, stress management techniques, limiting caffeine and alcohol, and getting adequate sleep. Some people find calcium supplements helpful.",
    "If PMS symptoms significantly impact your daily life, you might be experiencing PMDD (Premenstrual Dysphoric Disorder). Consider discussing this with your healthcare provider.",
  ],
  fertility: [
    "The fertile window typically occurs around days 11-21 of a 28-day cycle. Ovulation usually happens around day 14.",
    "Signs of ovulation include changes in cervical mucus (becoming clearer and more slippery), a slight rise in basal body temperature, and sometimes mild pelvic pain (mittelschmerz).",
    "Factors that can affect fertility include age, weight, smoking, alcohol consumption, stress, and certain medical conditions. Maintaining a healthy lifestyle can support fertility.",
  ],
  pcos: [
    "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder common among women of reproductive age. Symptoms include irregular periods, excess androgen levels, and polycystic ovaries.",
    "PCOS management often includes lifestyle modifications like regular exercise and a balanced diet. Medications may be prescribed to regulate periods, reduce symptoms, and improve fertility.",
    "Women with PCOS have a higher risk of developing type 2 diabetes, heart disease, and endometrial cancer. Regular check-ups with your healthcare provider are important.",
  ],
  general: [
    "I'm your women's health assistant. Feel free to ask me about menstrual cycles, fertility, hormonal health, or other women's health topics.",
    "Regular gynecological check-ups are recommended for preventive care. The frequency depends on your age and risk factors.",
    "Remember that every body is different, and what's normal varies from person to person. If you have concerns about your health, it's always best to consult with a healthcare provider.",
  ],
}

export default function ChatPage() {
  const { colors } = useTheme()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your health assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setMessage("")

    // Generate bot response
    setTimeout(() => {
      let responseCategory = "general"
      const lowerCaseMessage = message.toLowerCase()

      // Determine response category based on user message
      if (
        lowerCaseMessage.includes("period") ||
        lowerCaseMessage.includes("menstrual") ||
        lowerCaseMessage.includes("cycle")
      ) {
        responseCategory = "period"
      } else if (lowerCaseMessage.includes("pms") || lowerCaseMessage.includes("premenstrual")) {
        responseCategory = "pms"
      } else if (
        lowerCaseMessage.includes("fertility") ||
        lowerCaseMessage.includes("pregnant") ||
        lowerCaseMessage.includes("ovulation")
      ) {
        responseCategory = "fertility"
      } else if (lowerCaseMessage.includes("pcos") || lowerCaseMessage.includes("polycystic")) {
        responseCategory = "pcos"
      }

      // Get random response from appropriate category
      const responses = botResponses[responseCategory]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 h-screen flex flex-col">
        <div className="border-b p-4">
          <h1 className="text-xl font-medium">Chat with Health Assistant</h1>
          <p className="text-sm text-gray-500">Ask questions about your cycle, symptoms, or general women's health</p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-6 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-darker)] flex items-center justify-center text-white mr-2 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.3 15.2L11 12.3V7H12.5V11.4L17 13.9L16.3 15.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.sender === "user" ? "bg-[var(--color-darker)] text-white" : "bg-white shadow-sm"
                  }`}
                >
                  <p className="text-[15px]">{msg.text}</p>
                  <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <button className="p-2 text-gray-500 hover:text-[var(--color-darker)]">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-[var(--color-darker)]">
                <Image size={20} />
              </button>
              <textarea
                className="flex-1 border rounded-lg mx-2 p-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-darker)] resize-none"
                placeholder="Type your message..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button className="p-2 text-gray-500 hover:text-[var(--color-darker)]">
                <Mic size={20} />
              </button>
              <button
                className="ml-2 bg-[var(--color-darker)] text-white p-3 rounded-lg hover:brightness-110"
                onClick={handleSendMessage}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

