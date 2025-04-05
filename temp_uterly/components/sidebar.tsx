"use client"

import { Home, Users, Stethoscope, BookOpen, Menu, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="sidebar fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 space-y-8">
      <Link href="/" className={`sidebar-icon ${isActive("/") ? "bg-white/20" : ""}`}>
        <Home size={24} />
      </Link>
      <Link href="/community" className={`sidebar-icon ${isActive("/community") ? "bg-white/20" : ""}`}>
        <Users size={24} />
      </Link>
      <Link href="/doctors" className={`sidebar-icon ${isActive("/doctors") ? "bg-white/20" : ""}`}>
        <Stethoscope size={24} />
      </Link>
      <Link href="/resources" className={`sidebar-icon ${isActive("/resources") ? "bg-white/20" : ""}`}>
        <BookOpen size={24} />
      </Link>
      <div className="flex-grow"></div>
      <button className="sidebar-icon">
        <Menu size={24} />
      </button>
      <Link href="/profile" className={`sidebar-icon ${isActive("/profile") ? "bg-white/20" : ""}`}>
        <User size={24} />
      </Link>
    </div>
  )
}

