"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, Minimize2, Maximize2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider-custom"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotProps {
  initialOpen?: boolean
}

export function Chatbot({ initialOpen = false }: ChatbotProps) {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isMinimized, setIsMinimized] = useState(false)
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

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "Based on your cycle data, this is normal during your menstrual phase.",
        "I recommend gentle exercise like yoga during this phase of your cycle.",
        "Your symptoms align with typical patterns for day 5 of your cycle.",
        "Would you like me to provide more information about managing these symptoms?",
        "I've added this to your health log. You can view trends in the Insights section.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

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

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-darker)] text-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.3 15.2L11 12.3V7H12.5V11.4L17 13.9L16.3 15.2Z"
            fill="currentColor"
          />
        </svg>
      </button>
    )
  }

  return (
    <div
      className={`fixed ${isMinimized ? "bottom-6 right-6 w-72" : "bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96"} bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 border`}
      style={{ height: isMinimized ? "60px" : "500px", maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="bg-[var(--color-darker)] text-white p-4 flex justify-between items-center">
        <h3 className="font-medium">Health Assistant</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="p-4 h-[calc(100%-120px)] overflow-y-auto bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user" ? "bg-[var(--color-darker)] text-white" : "bg-white border"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <textarea
                className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-[var(--color-darker)] resize-none"
                placeholder="Type your message..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className="bg-[var(--color-darker)] text-white p-2 rounded-r-lg hover:brightness-110"
                onClick={handleSendMessage}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

