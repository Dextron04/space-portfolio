"use client"

import { useEffect } from "react"

// Chrome and Safari don't play SVG favicon animations, so draw the same animation
// onto a canvas and swap the tab icon's href. Loop = 5s, same timeline as app/icon.svg.
const LOOP = 5000
const STROKES: { a: [number, number]; b: [number, number]; seg: [number, number, number, number] }[] = [
  { a: [8, 19], b: [26, 19], seg: [58, 61, 64, 70] }, // T bar
  { a: [17, 19], b: [17, 47], seg: [59, 62, 68, 75] }, // T stem
  { a: [35, 19], b: [35, 47], seg: [60, 63, 72, 79] }, // K stem
  { a: [35, 34], b: [47, 19], seg: [61, 64, 77, 85] }, // K upper arm
  { a: [39, 30.5], b: [48, 47], seg: [62, 65, 82, 90] }, // K lower arm
]
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const easeIn = (x: number) => x * x
const clamp = (x: number) => Math.min(1, Math.max(0, x))

// 1 = fully drawn, 0 = gone: hold, erase, wait, redraw
function progress(pct: number, [e0, e1, d0, d1]: [number, number, number, number]) {
  if (pct < e0) return 1
  if (pct < e1) return 1 - easeIn(clamp((pct - e0) / (e1 - e0)))
  if (pct < d0) return 0
  if (pct < d1) return easeOut(clamp((pct - d0) / (d1 - d0)))
  return 1
}
function cursorOn(pct: number) {
  if (pct < 54) return Math.floor(pct / 6) % 2 === 0
  if (pct < 58) return false
  if (pct < 60) return true
  if (pct < 92) return false
  return true
}

export default function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches

    const draw = (pct: number) => {
      ctx.clearRect(0, 0, 64, 64)
      ctx.fillStyle = "#0a0b0d"
      ctx.beginPath()
      ctx.roundRect(0, 0, 64, 64, 14)
      ctx.fill()
      ctx.strokeStyle = "#2a2d32"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(0.75, 0.75, 62.5, 62.5, 13.25)
      ctx.stroke()

      // the K finishing "pops" slightly
      const pop = pct >= 90 && pct < 98 ? 1 + 0.07 * Math.sin(((pct - 90) / 8) * Math.PI) : 1
      ctx.save()
      ctx.translate(32, 33)
      ctx.scale(pop, pop)
      ctx.translate(-32, -33)
      ctx.strokeStyle = "#f5f5f7"
      ctx.lineWidth = 5.2
      ctx.lineCap = "round"
      for (const s of STROKES) {
        const p = progress(pct, s.seg)
        if (p <= 0.01) continue
        ctx.beginPath()
        ctx.moveTo(s.a[0], s.a[1])
        ctx.lineTo(s.a[0] + (s.b[0] - s.a[0]) * p, s.a[1] + (s.b[1] - s.a[1]) * p)
        ctx.stroke()
      }
      ctx.restore()
      if (cursorOn(pct)) {
        ctx.fillStyle = "#f5f5f7"
        ctx.beginPath()
        ctx.roundRect(52, 41, 5, 6, 1)
        ctx.fill()
      }
    }

    const link = () => {
      let l = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!l) {
        l = document.createElement("link")
        l.rel = "icon"
        document.head.appendChild(l)
      }
      return l
    }
    const set = () => {
      const l = link()
      l.type = "image/png"
      l.removeAttribute("sizes")
      l.href = canvas.toDataURL("image/png")
    }

    draw(0)
    set()
    if (calm) return

    const t0 = performance.now()
    let lastKey = ""
    const id = setInterval(() => {
      const pct = (((performance.now() - t0) % LOOP) / LOOP) * 100
      // skip redundant frames while holding: key changes only on blink or while drawing
      const moving = pct >= 58 && pct < 98
      const key = moving ? pct.toFixed(1) : String(cursorOn(pct)) + "h"
      if (key === lastKey) return
      lastKey = key
      draw(pct)
      set()
    }, 80)
    return () => clearInterval(id)
  }, [])
  return null
}
