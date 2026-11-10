"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { LayoutGroup, MotionConfig, motion } from "framer-motion"
import { Github, Linkedin } from "lucide-react"
import { LINKS } from "@/lib/profile"
import AnimatedFavicon from "./AnimatedFavicon"

const NAV = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // pointer glow: write CSS vars directly, no React re-render
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return
    const move = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`)
      document.documentElement.style.setProperty("--my", `${e.clientY}px`)
    }
    addEventListener("pointermove", move, { passive: true })
    return () => removeEventListener("pointermove", move)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatedFavicon />
      <div className="glow" aria-hidden />
      <header className="font-mono text-[13px] sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="text-fg">
            <span className="text-accent">tushin</span>
            <span className="text-faint">@dev</span>
            <span className="hidden text-faint sm:inline">:~{pathname === "/" ? "" : pathname}$</span>
            <span className="cursor ml-1.5" />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <LayoutGroup>
              {NAV.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative px-2 py-1 transition-colors duration-150 ${active ? "text-fg" : "text-dim hover:text-fg"}`}
                  >
                    {l.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-[17px] h-px bg-accent"
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                      />
                    )}
                  </Link>
                )
              })}
            </LayoutGroup>
            <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hidden p-1.5 text-dim transition-colors hover:text-fg sm:block">
              <Github size={16} />
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hidden p-1.5 text-dim transition-colors hover:text-fg sm:block">
              <Linkedin size={16} />
            </a>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-line font-mono">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-[12px] text-faint sm:flex-row">
          <span>© {new Date().getFullYear()} Tushin Kulshreshtha</span>
          <span>
            exit 0 <span className="text-accent">●</span> all systems nominal
          </span>
        </div>
      </footer>
    </MotionConfig>
  )
}
