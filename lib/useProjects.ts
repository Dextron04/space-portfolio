"use client"

import { useEffect, useState } from "react"
import { Project, fetchGitHubProjects } from "@/lib/github"

const GITHUB_USERNAME = "Dextron04"
export const FEATURED_PROJECT_IDS = [817924934, 715984514, 924062761, 943776958, 933837207]

// module-level cache: home and /projects share one fetch per page load
let cache: Promise<Project[]> | null = null

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  useEffect(() => {
    cache ??= fetchGitHubProjects(GITHUB_USERNAME).then((ps) =>
      ps.map((p) => ({ ...p, featured: FEATURED_PROJECT_IDS.includes(p.id) }))
    )
    let live = true
    cache.then((ps) => live && setProjects(ps))
    return () => {
      live = false
    }
  }, [])
  return projects // null = loading
}
