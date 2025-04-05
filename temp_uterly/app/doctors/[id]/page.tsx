"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider-custom"
import Image from "next/image"
import { Star, Calendar, MapPin, ArrowLeft, Phone, Video, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data for a single doctor
const doctorData = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Gynecologist",
  rating: 4.9,
  reviews: 124,
  experience: "8 years",
  location: "123 Women's Health Center, New York, NY",
  distance: "2.5 miles",
  available: true,
  nextAvailable: "Today",
  image: "/placeholder.svg?height=150&width=150",
  bio: "Dr. Sarah Johnson is a board-certified gynecologist with over 8 years of experience specializing in women's reproductive health. She completed her medical degree at Harvard Medical School and her residency at Johns Hopkins Hospital. Dr. Johnson is passionate about providing comprehensive care for women at all stages of life.",
  education: [
    "Harvard Medical School, MD",
    "Johns Hopkins Hospital, Residency",
    "American Board of Obstetrics and Gynecology, Board Certification",
  ],
  languages: ["English", "Spanish"],
  insurances: ["Blue Cross", "Aetna", "UnitedHealthcare", "Cigna"],
}

// Available time slots
const timeSlots = [
  { date: "Today", slots: ["9:00 AM", "11:30 AM", "2:15 PM"] },
  { date: "Tomorrow", slots: ["10:00 AM", "1:45 PM", "4:30 PM"] },
  { date: "Wed, Apr 6", slots: ["9:30 AM", "12:00 PM", "3:15 PM"] },
]

export default function DoctorDetailPage() {
  const { colors } = useTheme()
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState(timeSlots[0].date)
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("video")

  // Get available slots for selected date
  const availableSlots = timeSlots.find((slot) => slot.date === selectedDate)?.slots || []

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/doctors" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to doctors</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctor Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start">
                <div className="mr-6">
                  <Image
                    src={doctorData.image || "/placeholder.svg"}
                    alt={doctorData.name}
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{doctorData.name}</h1>
                  <p className="text-gray-600">{doctorData.specialty}</p>

                  <div className="flex items-center mt-2">
                    <Star className="text-yellow-400 fill-yellow-400 w-5 h-5 mr-1" />
                    <span className="font-medium">{doctorData.rating}</span>
                    <span className="text-gray-500 ml-1">({doctorData.reviews} reviews)</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{doctorData.experience} experience</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{doctorData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-3">About</h2>
                <p className="text-gray-700">{doctorData.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-medium mb-3">Education</h2>
                  <ul className="space-y-2">
                    {doctorData.education.map((edu, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-darker)] mt-2 mr-2"></div>
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-medium mb-3">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {doctorData.languages.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-medium mb-3 mt-6">Insurance</h2>
                  <div className="flex flex-wrap gap-2">
                    {doctorData.insurances.map((insurance, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4">Book Appointment</h2>

              {/* Appointment Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Appointment Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`p-3 rounded-md flex flex-col items-center justify-center text-sm ${
                      appointmentType === "video" ? "bg-[var(--color-darker)] text-white" : "border"
                    }`}
                    onClick={() => setAppointmentType("video")}
                  >
                    <Video className="w-5 h-5 mb-1" />
                    <span>Video</span>
                  </button>
                  <button
                    className={`p-3 rounded-md flex flex-col items-center justify-center text-sm ${
                      appointmentType === "phone" ? "bg-[var(--color-darker)] text-white" : "border"
                    }`}
                    onClick={() => setAppointmentType("phone")}
                  >
                    <Phone className="w-5 h-5 mb-1" />
                    <span>Phone</span>
                  </button>
                  <button
                    className={`p-3 rounded-md flex flex-col items-center justify-center text-sm ${
                      appointmentType === "inPerson" ? "bg-[var(--color-darker)] text-white" : "border"
                    }`}
                    onClick={() => setAppointmentType("inPerson")}
                  >
                    <MapPin className="w-5 h-5 mb-1" />
                    <span>In Person</span>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.date}
                      className={`px-4 py-2 rounded-md whitespace-nowrap ${
                        selectedDate === slot.date ? "bg-[var(--color-darker)] text-white" : "border"
                      }`}
                      onClick={() => {
                        setSelectedDate(slot.date)
                        setSelectedTime("")
                      }}
                    >
                      {slot.date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      className={`appointment-slot ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Button */}
              <button
                className={`btn-primary w-full py-3 ${!selectedTime ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!selectedTime}
              >
                Book Appointment
              </button>

              <button className="btn-outline w-full py-3 mt-3 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Doctor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

