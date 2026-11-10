"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SKILLS, SKILL_NOTES } from "@/lib/profile"

const EASE = [0.2, 0, 0, 1] as const
const TOOLS = Object.entries(SKILLS).flatMap(([group, items]) => items.map((name) => ({ name, group })))
const GROUPS = Object.keys(SKILLS)

// Boot-up: tiles rise out of a blur in a 10ms cascade (~440ms total), once, when scrolled into view.
const list = { hidden: {}, show: { transition: { staggerChildren: 0.01 } } }
const item = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
}

export default function Toolbox() {
  const [group, setGroup] = useState<string | null>(null)
  const [active, setActive] = useState<(typeof TOOLS)[number] | null>(null)

  const spot = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter tools by group">
        <button className="chip" aria-pressed={group === null} onClick={() => setGroup(null)}>all</button>
        {GROUPS.map((g) => (
          <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(group === g ? null : g)}>
            {g}
          </button>
        ))}
      </div>

      <motion.ul
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
      >
        {TOOLS.map((t) => {
          const dim = group !== null && t.group !== group
          const on = active?.name === t.name
          return (
            <motion.li key={t.name} variants={item}>
              <button
                onPointerMove={spot}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(t)}
                onFocus={() => setActive(t)}
                onClick={() => setActive(t)}
                aria-pressed={on}
                className={`group relative flex h-16 w-full flex-col justify-between overflow-hidden border border-b-2 border-line bg-surface/70 px-3 py-2 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-[opacity,transform,border-color,background-color,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5 hover:border-faint hover:bg-surface active:translate-y-px active:scale-[0.97] active:duration-100 ${
                  on ? "border-fg/70 bg-surface" : ""
                } ${dim ? "scale-[0.96] opacity-25 grayscale" : ""}`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(110px circle at var(--x, 50%) var(--y, 50%), rgb(var(--fg) / 0.1), transparent 70%)" }}
                />
                <span className="relative font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{t.group.split("/")[0]}</span>
                <span className="relative text-[15px] font-medium tracking-tight text-fg">{t.name}</span>
              </button>
            </motion.li>
          )
        })}
      </motion.ul>

      <div className="mt-5 min-h-[3.25rem] border-t border-line pt-4 font-mono text-[13px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active?.name ?? "idle"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="text-dim"
          >
            {active ? (
              <>
                <span className="text-faint">$ man </span>
                <span className="text-fg">{active.name}</span>
                <span className="text-faint"> — </span>
                {SKILL_NOTES[active.name] ?? `${active.group}`}
              </>
            ) : (
              <span className="text-faint">$ hover or tap a tool to see where I&apos;ve used it<span className="cursor ml-1.5" /></span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
