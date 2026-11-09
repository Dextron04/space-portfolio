"use client"

import { useMemo, useState } from "react"

import ProjectGrid from "@/components/ProjectGrid"
import ScrambleText from "@/components/ScrambleText"
import { useProjects } from "@/lib/useProjects"

export default function ProjectsPage() {
  const projects = useProjects()
  const [q, setQ] = useState("")
  const [lang, setLang] = useState<string | null>(null)

  const langs = useMemo(() => {
    const count: Record<string, number> = {}
    projects?.forEach((p) => p.language && (count[p.language] = (count[p.language] ?? 0) + 1))
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([l]) => l)
  }, [projects])

  const shown = useMemo(() => {
    const needle = q.toLowerCase()
    return (projects ?? [])
      .filter((p) => (!lang || p.language === lang) && `${p.name} ${p.description ?? ""} ${p.topics.join(" ")}`.toLowerCase().includes(needle))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }, [projects, q, lang])

  return (
    <div className="mx-auto max-w-6xl px-5 py-24">
      <p className="label mb-4"><span className="text-accent">$</span> ls ~/projects</p>
      <h1 className="font-sans font-medium tracking-tight text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
        <ScrambleText text="Projects" />
      </h1>

      {projects?.length === 0 ? (
        <p className="mt-14 text-dim">
          <span className="text-accent">error:</span> couldn&apos;t reach GitHub. Try again, or browse{" "}
          <a href="https://github.com/Dextron04" className="text-accent underline underline-offset-4">github.com/Dextron04</a>.
        </p>
      ) : (
        <>
          <div className="mt-12 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center">
            <label className="flex flex-1 items-center gap-2">
              <span className="whitespace-nowrap font-mono text-accent">grep -i</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search…"
                className="w-full bg-transparent text-fg placeholder:text-faint focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="chip" aria-pressed={lang === null} onClick={() => setLang(null)}>all</button>
              {langs.map((l) => (
                <button key={l} className="chip" aria-pressed={lang === l} onClick={() => setLang(lang === l ? null : l)}>{l}</button>
              ))}
            </div>
          </div>
          <p className="py-3 font-mono text-faint">{projects ? `${shown.length} of ${projects.length} repos` : "fetching repos…"}</p>
          {projects && shown.length === 0 ? (
            <p className="py-16 text-dim">no matches. <button className="text-accent underline underline-offset-4" onClick={() => { setQ(""); setLang(null) }}>clear filters</button></p>
          ) : (
            <ProjectGrid projects={projects && shown} skeletons={9} />
          )}
        </>
      )}
    </div>
  )
}
