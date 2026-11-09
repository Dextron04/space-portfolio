"use client"

import { motion } from "framer-motion"

const EASE = [0.2, 0, 0, 1] as const

// Entrance: 16px rise + fade, 500ms, decelerate. Stagger via `delay` (<=100ms steps).
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
