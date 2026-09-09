import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import GiveModal from "@/components/features/give/GiveModal"
import { Toaster } from "@/components/ui/toaster"
import IntuitiveHeader from "@/components/layout/IntuitiveHeader"
import Footer from "@/components/layout/Footer"
import type React from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "RCCG Halleluyah House | Grayslake, IL",
  description:
    "A Spirit-filled Pentecostal church in Grayslake, Illinois — making heaven and taking as many people as possible with us.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <IntuitiveHeader />
          <GiveModal />
          <div className="w-full overflow-x-hidden pt-20 lg:pt-24">{children}</div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

