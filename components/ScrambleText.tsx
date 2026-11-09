"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

const GLYPHS = "01<>/\\{}[]|_=+-;:"
const blank = (s: string) => s.replace(/\S/g, " ")

// Decodes left-to-right from terminal glyphs. Real text is always exposed via aria-label.
export default function ScrambleText({
  text,
  delay = 0,
  className = "",
  onView = false,
}: {
  text: string
  delay?: number
  className?: string
  onView?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const [out, setOut] = useState(text)
  const [armed, setArmed] = useState(false)

  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setOut(blank(text))
    setArmed(true)
  }, [text])

  useEffect(() => {
    if (!armed || (onView && !inView)) return
    const dur = Math.min(1000, 280 + text.length * 40)
    const settle = Array.from(text, (_, i) => (i / text.length) * dur * 0.7 + Math.random() * dur * 0.3)
    let raf = 0
    let last = 0
    let t0 = 0
    const step = (now: number) => {
      if (!t0) t0 = now
      const t = now - t0
      if (now - last > 40 || t >= dur) {
        last = now
        setOut(
          Array.from(text, (ch, i) =>
            /\s/.test(ch) ? ch : t >= settle[i] ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          ).join("")
        )
      }
      if (t < dur) raf = requestAnimationFrame(step)
    }
    const id = setTimeout(() => (raf = requestAnimationFrame(step)), delay)
    return () => {
      clearTimeout(id)
      cancelAnimationFrame(raf)
    }
  }, [armed, inView, onView, text, delay])

  return (
    <span ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{out}</span>
    </span>
  )
}
