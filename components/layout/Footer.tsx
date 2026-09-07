import Link from "next/link"
import { Instagram, MapPin, Phone, Mail } from "lucide-react"

const church = [
  { href: "/about/our-story", label: "Who we are" },
  { href: "/about/leadership", label: "Our Pastors" },
  { href: "/give", label: "Give" },
]

const activities = [
  { href: "#", label: "Online Church" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
]

const getInvolved = [
  { href: "/contact", label: "Become a member" },
  { href: "/contact", label: "Join a department" },
  { href: "/contact", label: "Join your family" },
  { href: "/contact", label: "Start Believers' class" },
]

const legal = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
]

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden bg-background pb-6 pt-16 md:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Floating card */}
        <div className="rounded-[2.5rem] border border-border bg-card px-8 py-12 shadow-xl md:px-12 md:py-14">
          {/* Main grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="mb-5 inline-flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                  <img
                    src="/images/Rccg_logo.png"
                    alt="RCCG Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-bold leading-none text-foreground">Halleluyah House</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    RCCG · Grayslake, IL
                  </p>
                </div>
              </Link>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                A Spirit-filled Pentecostal church in Grayslake, Illinois — making heaven and taking
                as many people as possible with us.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="transition-transform hover:-translate-y-1"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#1877F2" />
                    <path
                      d="M14.6 12H12.5V18.5H9.5V12H8V9H9.5V7C9.5 5 11 4 12.8 4C13.8 4 14.5 4.1 14.5 4.1V6.5H13.2C12.3 6.5 12.1 6.9 12.1 7.6V9H14.8L14.6 12Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="transition-transform hover:-translate-y-1"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="6" width="20" height="12" rx="4" fill="#FF0000" />
                    <polygon points="10,9 16,12 10,15" fill="white" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                    <svg fill="white" width="16" height="16" viewBox="0 0 448 512">
                      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                    </svg>
                  </div>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="transition-transform hover:-translate-y-1"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                    }}
                  >
                    <Instagram stroke="white" strokeWidth={2} className="h-4 w-4" />
                  </div>
                </a>
              </div>
            </div>

            {/* Church links */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">
                Church
              </h3>
              <ul className="space-y-3">
                {church.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities links */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">
                Activities
              </h3>
              <ul className="space-y-3">
                {activities.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved links */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">
                Get Involved
              </h3>
              <ul className="space-y-3">
                {getInvolved.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visit */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-foreground">
                Visit
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://maps.google.com/?q=888+E+Belvidere+Rd+Suite+403+Grayslake+IL+60030"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-[#16A34A]"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="text-sm leading-snug">
                      888 E. Belvidere Rd, Suite 403
                      <br />
                      Grayslake, IL 60030
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:8478109094"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    847 810 9094
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@rccghalleluyahhouse.org"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-[#16A34A]"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    info@rccghalleluyahhouse.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RCCG Halleluyah House · All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <p className="pointer-events-none mt-1 select-none overflow-hidden whitespace-nowrap text-center text-[clamp(3rem,12vw,9rem)] font-black leading-none tracking-tight text-black/[0.04] dark:text-white/[0.06]">
          Halleluyah House
        </p>
      </div>
    </footer>
  )
}
