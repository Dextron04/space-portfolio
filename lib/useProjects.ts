"use client"

import { useEffect, useState } from "react"
import { Project, fetchGitHubProjects } from "@/lib/github"

const GITHUB_USERNAME = "Dextron04"
// order = display order on the home page
export const FEATURED_PROJECT_IDS = [
  1081600376, // dex_bridge
  1429000124, // newtonite-swipe
  1039740955, // resume-agent
  960726721, // SafeWalk
  1042979752, // ConnectX-Mobile
  817924934, // File-System-Project
]

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
