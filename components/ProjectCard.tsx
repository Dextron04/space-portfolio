import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/github"
import { toKebabCase } from "@/lib/utils"

export default function ProjectCard({ project }: { project: Project }) {
  const tags = [project.language, ...project.topics].filter(Boolean).slice(0, 3) as string[]
  return (
    <Link
      href={`/projects/${toKebabCase(project.name)}`}
      data-ascii="surface"
      className="group flex min-h-[220px] flex-col border border-line bg-surface/60 p-5 transition-[border-color,transform,background-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5 hover:border-faint hover:bg-surface"
    >
      <h3 className="text-lg font-medium tracking-tight">
        {project.name}
        {project.featured && <span className="ml-2 align-middle text-[11px] text-faint">★</span>}
      </h3>
      <p className="mt-2 line-clamp-3 text-dim">{project.description || "No description available."}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {tags.map((t) => (
          <span key={t} data-ascii="fade" className="chip">{t}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[12px] text-faint">
        <span>{new Date(project.created_at).getFullYear()}</span>
        <ArrowUpRight size={15} className="transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
      </div>
    </Link>
  )
}
