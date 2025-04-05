import type { ReactNode } from "react"
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ThemeProviderCustom } from "@/components/theme-provider-custom"
import { ThemeProvider } from "@/components/theme-provider"
import { CyclePhase } from "@/types/cycle-phases"
import { Chatbot } from "@/components/chatbot"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"

// Font setup
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center`}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <ThemeProviderCustom defaultPhase={CyclePhase.MENSTRUAL}>
              {/* Clerk Auth Buttons Header */}
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>

              {/* Page Content */}
              {children}

              {/* Chatbot Component */}
              <Chatbot />
            </ThemeProviderCustom>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
