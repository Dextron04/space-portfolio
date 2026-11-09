"use client"

import { motion } from "framer-motion"
import { STATS, type Stat } from "@/lib/profile"

const EASE = [0.2, 0, 0, 1] as const

function Bar({ pct, text, strong, delay }: { pct: number; text: string; strong?: boolean; delay: number }) {
  return (
    <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 font-mono text-[12px]">
      <span className="text-faint">{strong ? "after" : "before"}</span>
      <div className="h-1.5 bg-line">
        <motion.div
          className={`h-full origin-left ${strong ? "bg-fg" : "bg-faint"}`}
          style={{ width: `${pct}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay }}
        />
      </div>
      <span className={strong ? "text-fg" : "text-dim"}>{text}</span>
    </div>
  )
}

function Cell({ stat, wide, i }: { stat: Stat; wide: boolean; i: number }) {
  const delta = stat.from && stat.to
  return (
    <motion.div
      className={`flex flex-col bg-bg p-6 md:p-8 ${wide ? "lg:col-span-3" : "lg:col-span-2"} sm:col-span-1`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
    >
      <p className="label">{stat.tag}</p>
      <p className="mt-6 flex items-baseline gap-3 text-[clamp(2.75rem,5vw,4.25rem)] font-medium leading-none tracking-tight tabular-nums">
        {delta ? (
          <>
            <span className="text-faint">{stat.from!.text}</span>
            <span className="text-[0.5em] text-faint">→</span>
            <span>{stat.to!.text}</span>
          </>
        ) : (
          stat.value
        )}
      </p>
      {delta && (
        <div className="mt-6 space-y-2">
          <Bar pct={stat.from!.pct} text={stat.from!.text} delay={0.2 + i * 0.06} />
          <Bar pct={stat.to!.pct} text={stat.to!.text} strong delay={0.45 + i * 0.06} />
        </div>
      )}
      <p className={`mt-auto max-w-sm pt-6 text-dim ${delta ? "" : "pt-8"}`}>{stat.label}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
      {STATS.map((s, i) => (
        <Cell key={s.tag} stat={s} wide={i < 2} i={i} />
      ))}
    </div>
  )
}
