"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import Reveal from "@/components/Reveal"
import ScrambleText from "@/components/ScrambleText"
import SectionHead from "@/components/SectionHead"
import { BIO, EDUCATION, EXPERIENCE, INTERESTS, LINKS, PHOTOS } from "@/lib/profile"

export default function AboutPage() {
  const [open, setOpen] = useState<number | null>(null)
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length)), [])

  useEffect(() => {
    if (open === null) return
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    addEventListener("keydown", key)
    return () => removeEventListener("keydown", key)
  }, [open, step])

  const photo = open === null ? null : PHOTOS[open]

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="py-24">
        <p className="label mb-4"><span className="text-accent">$</span> cat ~/about.md</p>
        <h1 className="font-sans font-medium tracking-tight text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
          <ScrambleText text="About" /> <em className="not-italic text-faint"><ScrambleText text="me" delay={200} /></em>
        </h1>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 text-dim">
            {BIO.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}><p>{p}</p></Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="label mb-3">interests</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
            <a href={LINKS.resume} download className="btn btn-solid mt-8">resume ↓</a>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <SectionHead n="01" path="~/experience" title="git log" />
        <ol className="relative border-l border-line pl-8">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.org} delay={i * 0.06} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 border border-accent bg-bg" />
              <p className="text-faint">{e.period}</p>
              <h3 className="mt-1 font-sans font-medium tracking-tight text-3xl">{e.role}</h3>
              <p className="text-accent">{e.org}{e.where && <span className="text-faint"> · {e.where}</span>}</p>
              <p className="mt-3 max-w-2xl text-dim">{e.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="py-16">
        <SectionHead n="02" path="~/education" title="Education" />
        <Reveal className="max-w-2xl border border-line bg-surface/70 p-6">
          <p className="text-faint">{EDUCATION.period}</p>
          <h3 className="mt-1 font-sans font-medium tracking-tight text-3xl">{EDUCATION.degree}</h3>
          <p className="text-accent">{EDUCATION.org}</p>
          <p className="mt-3 text-dim">{EDUCATION.body}</p>
        </Reveal>
      </section>

      <section className="py-16 pb-24">
        <SectionHead n="03" path="~/photos" title="Off the clock" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.src} delay={(i % 3) * 0.06}>
              <button onClick={() => setOpen(i)} className="group relative block aspect-[4/3] w-full overflow-hidden border border-line text-left">
                <Image src={p.src} alt={p.title} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover grayscale transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105 group-hover:grayscale-0" />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-bg/85 px-3 py-2 text-[12px] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-y-0">
                  {p.title} <span className="text-faint">· {p.date}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {photo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal
            aria-label={photo.title}
          >
            <motion.figure
              key={photo.src}
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[70vh]">
                <Image src={photo.src} alt={photo.title} fill sizes="90vw" className="object-contain" />
              </div>
              <figcaption className="mt-3 flex justify-between text-dim">
                <span>{photo.title} — {photo.note}</span>
                <span className="text-faint">{photo.date} · {String((open ?? 0) + 1).padStart(2, "0")}/{String(PHOTOS.length).padStart(2, "0")}</span>
              </figcaption>
            </motion.figure>
            <button aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 p-2 text-dim hover:text-fg"><X size={20} /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1) }} className="absolute left-3 top-1/2 p-2 text-dim hover:text-fg"><ChevronLeft size={28} /></button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1) }} className="absolute right-3 top-1/2 p-2 text-dim hover:text-fg"><ChevronRight size={28} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
