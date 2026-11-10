import { Lock } from "lucide-react"
import Reveal from "./Reveal"
import { PRIVATE_WORK } from "@/lib/profile"

export default function PrivateWork() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
      {PRIVATE_WORK.map((w, i) => (
        <Reveal key={w.name} delay={(i % 2) * 0.06} className="bg-bg">
          <article className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-sans text-lg font-medium tracking-tight">{w.name}</h3>
              <span className="chip inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-faint" title="Source is private; not available to the public">
                <Lock size={11} aria-hidden /> private
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              {w.kind} · {w.span}
            </p>
            <p className="text-[15px] leading-relaxed text-dim">{w.note}</p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {w.stack.map((s) => (
                <li key={s} className="chip">{s}</li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  )
}
