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
  1368708279, // auto-reel-creation
]

// short blurbs shown on cards; used when a repo has no GitHub description of its own
const BLURBS: Record<string, string> = {
  dex_bridge: "Shared long-term memory for LLMs: captures ChatGPT and Claude chats into a local Qdrant store, searchable over MCP.",
  "newtonite-swipe": "Tinder-style screening for engineering-challenge submissions, with live GitHub signals like tests, CI and Docker.",
  "resume-agent": "FastAPI + Claude service that tailors ATS-friendly resumes to a job description from your own experience.",
  SafeWalk: "Real-time pedestrian safety navigator: finds the safest, shortest walking routes and flags danger zones.",
  "ConnectX-Mobile": "React Native client for the ConnectX chat app: real-time Socket.IO messaging with push notifications.",
  "File-System-Project": "A FAT-style file system in C with a virtual disk and an interactive shell for files and directories.",
}

// module-level cache: home and /projects share one fetch per page load
let cache: Promise<Project[]> | null = null

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  useEffect(() => {
    cache ??= fetchGitHubProjects(GITHUB_USERNAME).then((ps) =>
      ps.map((p) => ({ ...p, description: p.description || BLURBS[p.name] || null, featured: FEATURED_PROJECT_IDS.includes(p.id) }))
    )
    let live = true
    cache.then((ps) => live && setProjects(ps))
    return () => {
      live = false
    }
  }, [])
  return projects // null = loading
}
