"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { useTheme } from "@/components/theme-provider-custom"
import Image from "next/image"
import { Search, Star, Calendar, MapPin, Clock, Filter } from "lucide-react"
import Link from "next/link"

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Gynecologist",
    rating: 4.9,
    reviews: 124,
    experience: "8 years",
    location: "New York, NY",
    distance: "2.5 miles",
    available: true,
    nextAvailable: "Today",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialty: "Obstetrician",
    rating: 4.8,
    reviews: 98,
    experience: "12 years",
    location: "New York, NY",
    distance: "3.2 miles",
    available: true,
    nextAvailable: "Tomorrow",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Dr. Michael Rodriguez",
    specialty: "Reproductive Endocrinologist",
    rating: 4.7,
    reviews: 86,
    experience: "15 years",
    location: "New York, NY",
    distance: "4.1 miles",
    available: false,
    nextAvailable: "Next Week",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Dr. Lisa Thompson",
    specialty: "Gynecologist",
    rating: 4.9,
    reviews: 112,
    experience: "10 years",
    location: "New York, NY",
    distance: "1.8 miles",
    available: true,
    nextAvailable: "Today",
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Specialties for filter
const specialties = [
  "All Specialties",
  "Gynecologist",
  "Obstetrician",
  "Reproductive Endocrinologist",
  "Fertility Specialist",
]

export default function DoctorsPage() {
  const { colors } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by search term
    if (
      searchTerm &&
      !doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by specialty
    if (selectedSpecialty !== "All Specialties" && doctor.specialty !== selectedSpecialty) {
      return false
    }

    // Filter by availability
    if (showAvailableOnly && !doctor.available) {
      return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-16 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
            <p className="text-gray-600">Connect with specialists for your women's health needs</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by doctor name or specialty"
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <select
                  className="w-full p-3 border rounded-lg bg-white"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <button className="flex items-center gap-2 px-4 py-3 border rounded-lg">
                <Filter size={18} />
                <span>More Filters</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                  className="rounded"
                />
                <span>Available Today</span>
              </label>
            </div>
          </div>

          {/* Doctor List */}
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctors found matching your criteria</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
                  <div className="doctor-card flex">
                    <div className="mr-4">
                      <Image
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                        </div>

                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-yellow-400 w-4 h-4 mr-1" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({doctor.reviews})</span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-y-2">
                        <div className="flex items-center text-sm text-gray-600 mr-4">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{doctor.experience}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 mr-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{doctor.distance}</span>
                        </div>

                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className={doctor.available ? "text-green-600" : "text-gray-600"}>
                            {doctor.nextAvailable}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

