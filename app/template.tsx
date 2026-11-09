"use client"

import { motion } from "framer-motion"

// Page transition: 350ms rise-in on every navigation (template remounts per route).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.main>
  )
}
