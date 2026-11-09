"use client"

import type { CSSProperties } from "react"
import { AsciiReveal, AsciiSkeleton } from "ascii-reveal"
import type { Project } from "@/lib/github"
import ProjectCard from "./ProjectCard"

// theme for the library: monochrome, system mono
export const asciiTheme = {
  "--ascii-accent": "#f5f5f7",
  "--ascii-skeleton": "#4b5058",
  "--ascii-font": "ui-monospace, SFMono-Regular, Menlo, monospace",
  "--ascii-surface": "#0a0b0d",
} as CSSProperties

function SkeletonCard({ seed }: { seed: number }) {
  return (
    <div className="flex min-h-[220px] flex-col border border-line bg-surface/60 p-5">
      <AsciiSkeleton variant="terminal" lines={1} widths={["55%"]} seed={seed} />
      <div className="mt-4">
        <AsciiSkeleton variant="terminal" lines={3} seed={seed + 11} />
      </div>
      <div className="mt-auto pt-5">
        <AsciiSkeleton variant="terminal" lines={1} widths={["40%"]} seed={seed + 23} />
      </div>
    </div>
  )
}

// projects === null → skeleton cards; array → real cards decode in through the character grid
export default function ProjectGrid({ projects, skeletons = 6 }: { projects: Project[] | null; skeletons?: number }) {
  return (
    <AsciiReveal loading={projects === null} preset="terminal" style={asciiTheme}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects === null
          ? Array.from({ length: skeletons }, (_, i) => <SkeletonCard key={i} seed={i + 1} />)
          : projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </AsciiReveal>
  )
}
