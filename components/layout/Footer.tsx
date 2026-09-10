import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

const church = [
  { href: "/about/our-story", label: "Who we are" },
  { href: "/give", label: "Give" },
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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
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
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                A Spirit-filled Pentecostal church in Grayslake, Illinois — making heaven and taking
                as many people as possible with us.
              </p>
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
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
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
