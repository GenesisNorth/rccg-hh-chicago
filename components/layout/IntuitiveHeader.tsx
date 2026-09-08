"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, ChevronDown, HandHeart } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function IntuitiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const handleDropdownToggle = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  const menuItems = [
    { href: "/", label: "Home", key: "home" },
    {
      label: "About Us",
      key: "about",
      hasDropdown: true,
      items: [
        { href: "/about/our-story", label: "Our Stories" },
        { href: "/about/our-values", label: "Our Values" },
        { href: "/about/what-we-believe", label: "Our Beliefs" },
      ],
    },
    {
      label: "Ministries",
      key: "ministries",
      hasDropdown: true,
      items: [
        { href: "/prayer-requests", label: "Prayer Ministry" },
        { href: "/ministries/men", label: "Men's Ministry" },
        { href: "/ministries/women", label: "Women's Ministry" },
        { href: "/ministries/youth", label: "Youth Ministry" },
      ],
    },
    { href: "/salvation", label: "Salvation", key: "salvation" },
    { href: "/prayer-requests", label: "Prayer", key: "prayer" },
    { href: "/testimonies", label: "Testimonies", key: "testimonies" },
    { href: "/give", label: "Give", key: "give" },
    { href: "/contact", label: "Contact Us", key: "contact" },
  ]

  return (
    <header
      className={`fixed top-3 left-[3%] right-[3%] z-50 transition-all duration-300 ease-in-out rounded-2xl ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl shadow-2xl border border-border/40"
          : "bg-white/55 backdrop-blur-lg shadow-lg border border-border/30"
      }`}
    >
      <div className="px-4 sm:px-5 lg:px-6">
        {/* 3-section row: logo | nav (centered) | actions */}
        <div className="flex items-center h-14 lg:h-16">

          {/* Logo */}
          <div className="flex-none ml-4 lg:ml-8 xl:ml-12">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border transition-transform hover:scale-105 lg:h-11 lg:w-11">
                <img
                  src="/images/Rccg_logo.png"
                  alt="RCCG Halleluyah House Logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav — flex-1 keeps it centred between logo and actions */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1">
            {menuItems.map((item) => (
              <div key={item.key} className="relative">
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.key)}
                    className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 ${
                      openDropdown === item.key
                        ? "text-green-600 bg-white/80"
                        : "text-foreground hover:text-green-600 hover:bg-white/60"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                        openDropdown === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`block text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? "text-green-600 bg-white/80"
                        : "text-foreground hover:text-green-600 hover:bg-white/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown panel */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {openDropdown === item.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 rounded-xl shadow-xl bg-white/90 backdrop-blur-xl border border-border/60 overflow-hidden z-50"
                      >
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2.5 text-sm font-medium text-foreground hover:text-green-600 hover:bg-green-50/60 transition-colors duration-150"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions — ml-auto pushes to far right on mobile when nav is hidden */}
          <div className="flex-none flex items-center gap-1.5 sm:gap-2 ml-auto">

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg hover:bg-white/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Plan a visit — replaces the old account menu */}
            <div className="hidden lg:flex items-center gap-1.5">
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-foreground hover:text-green-600 hover:bg-white/60"
                >
                  Plan a Visit
                </Button>
              </Link>
              <Link href="/prayer-requests">
                <Button
                  size="sm"
                  className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1.5"
                >
                  <HandHeart className="h-3.5 w-3.5" />
                  Prayer
                </Button>
              </Link>
            </div>

            {/* Listen Live CTA */}
            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="text-xs lg:text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <span className="hidden lg:inline">LISTEN LIVE</span>
                  <span className="lg:hidden">LIVE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-card animate-pulse flex-shrink-0" />
                </Button>
              </a>
            </div>


            {/* Mobile hamburger — hidden on lg+ */}
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/60 transition-all duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu — slides down inside the floating header */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Nav links */}
              {menuItems.map((item) => (
                <div key={item.key}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.key)}
                        className={`flex justify-between items-center w-full text-sm font-medium px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          openDropdown === item.key
                            ? "bg-white/70 text-green-600"
                            : "text-foreground hover:text-green-600 hover:bg-white/50"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                            openDropdown === item.key ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 pl-3 border-l-2 border-green-200 mt-1 space-y-0.5"
                          >
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block text-sm font-medium text-muted-foreground hover:text-green-600 py-2 px-2 rounded-lg hover:bg-white/50 transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={`block text-sm font-medium px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                        pathname === item.href
                          ? "bg-white/70 text-green-600"
                          : "text-foreground hover:text-green-600 hover:bg-white/50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Action buttons */}
              <div className="border-t border-border/60 pt-3 mt-2 space-y-2">
                <div className="flex gap-2">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-sm">
                      Plan a Visit
                    </Button>
                  </Link>
                  <Link href="/prayer-requests" onClick={() => setIsMenuOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full text-sm bg-green-600 hover:bg-green-700 text-white">
                      Prayer
                    </Button>
                  </Link>
                </div>

                {/* Give + Listen Live — always shown in mobile menu */}
                <div className="flex gap-2 pt-1">
                  <Link href="/give" onClick={() => setIsMenuOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full text-sm bg-green-600 hover:bg-green-700 text-white">
                      Give
                    </Button>
                  </Link>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5">
                      LISTEN LIVE
                      <span className="h-1.5 w-1.5 rounded-full bg-card animate-pulse flex-shrink-0" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
