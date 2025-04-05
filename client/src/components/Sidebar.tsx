import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, Stethoscope, BookOpen, Menu, User, Calendar, BarChart3, Bell, MessageCircle } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="sidebar fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 space-y-8">
      <Link href="/" className={`sidebar-icon ${isActive("/") ? "bg-white/20" : ""}`}>
        <Home size={24} />
      </Link>
      <Link href="/calendar" className={`sidebar-icon ${isActive("/calendar") ? "bg-white/20" : ""}`}>
        <Calendar size={24} />
      </Link>
      <Link href="/insights" className={`sidebar-icon ${isActive("/insights") ? "bg-white/20" : ""}`}>
        <BarChart3 size={24} />
      </Link>
      <Link href="/reminders" className={`sidebar-icon ${isActive("/reminders") ? "bg-white/20" : ""}`}>
        <Bell size={24} />
      </Link>
      <Link href="/chat" className={`sidebar-icon ${isActive("/chat") ? "bg-white/20" : ""}`}>
        <MessageCircle size={24} />
      </Link>
      <Link href="/pcos" className={`sidebar-icon ${isActive("/pcos") ? "bg-white/20" : ""}`}>
        <Stethoscope size={24} />
      </Link>
      <div className="flex-grow"></div>
      <button className="sidebar-icon">
        <Menu size={24} />
      </button>
      <Link href="/profile" className={`sidebar-icon ${isActive("/profile") ? "bg-white/20" : ""}`}>
        <User size={24} />
      </Link>
    </div>
  );
}