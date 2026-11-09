"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { AsciiReveal, AsciiSkeleton } from "ascii-reveal"
import { asciiTheme } from "@/components/ProjectGrid"
import ScrambleText from "@/components/ScrambleText"
import type { GitHubRepo } from "@/lib/github"
import { toKebabCase } from "@/lib/utils"

const GITHUB_USERNAME = "Dextron04"

type State = { repo: GitHubRepo | null; title?: string; content: string; error: string; loading: boolean }

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [s, setS] = useState<State>({ repo: null, content: "", error: "", loading: true })

  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
        if (!res.ok) throw new Error("Could not fetch repos")
        const repos: (GitHubRepo & { default_branch?: string })[] = await res.json()
        const repo = repos.find((r) => toKebabCase(r.name) === slug)
        if (!repo) throw new Error("Repo not found")
        const branch = repo.default_branch || "main"
        for (const path of [`content/projects/${slug}.md`, "README.md"]) {
          const raw = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/${path}`)
          if (!raw.ok) continue
          const { data, content } = matter(await raw.text())
          if (live) setS({ repo, title: data.title, content, error: "", loading: false })
          return
        }
        throw new Error("Project markdown not found.")
      } catch (e) {
        if (live) setS((p) => ({ ...p, loading: false, error: e instanceof Error ? e.message : "Project not found." }))
      }
    })()
    return () => {
      live = false
    }
  }, [slug])

  const { repo } = s

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/projects" className="inline-flex items-center gap-2 text-dim transition-colors hover:text-fg">
        <ArrowLeft size={14} /> cd ..
      </Link>

      {s.loading ? (
        <AsciiReveal loading preset="terminal" style={asciiTheme} className="mt-12">
          <AsciiSkeleton variant="terminal" lines={1} widths={["60%"]} />
          <div className="mt-8"><AsciiSkeleton variant="terminal" lines={14} /></div>
        </AsciiReveal>
      ) : s.error || !repo ? (
        <p className="mt-12 text-dim"><span className="text-accent">error:</span> {s.error || "Repository not found."}</p>
      ) : (
        <AsciiReveal preset="terminal" style={asciiTheme} className="mt-12">
        <article>
          <div className="mb-4 flex flex-wrap gap-2">
            {repo.language && <span className="chip">{repo.language}</span>}
            <span className="chip">{new Date(repo.created_at).getFullYear()}</span>
            {repo.topics?.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <h1 className="font-sans font-medium tracking-tight text-5xl leading-none md:text-7xl">
            <ScrambleText text={s.title || repo.name} />
          </h1>
          <div className="md mt-10 border-t border-line pt-6">
            <ReactMarkdown>{s.content}</ReactMarkdown>
          </div>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn mt-8">
            view on github <ArrowUpRight size={14} />
          </a>
        </article>
        </AsciiReveal>
      )}
    </div>
  )
}
