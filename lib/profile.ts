export const LINKS = {
  github: "https://github.com/Dextron04",
  email: "mailto:tushink04@gmail.com",
  linkedin: "https://www.linkedin.com/in/tushin-kulshreshtha-2522b8231/",
  resume: "/Tushin_Resume.pdf",
}

export const FACTS: [string, string][] = [
  ["location", "San Francisco, CA"],
  ["now", "Software Engineer @ US Neuro"],
  ["also", "CTO & Co-Founder @ Newtonite"],
  ["focus", "system architecture · workflow automation · AI agents"],
  ["education", "B.S. Computer Science · SFSU · 3.95 GPA"],
]

export type Stat = {
  tag: string
  label: string
  value?: string
  from?: { text: string; pct: number }
  to?: { text: string; pct: number }
}

export const STATS: Stat[] = [
  { tag: "us neuro · throughput", from: { text: "10", pct: 10 }, to: { text: "100", pct: 100 }, label: "Cases processed per day on an automation system I architected and run solo." },
  { tag: "sellwizr · deploy time", from: { text: "100%", pct: 100 }, to: { text: "60%", pct: 60 }, label: "Docker-based microservices for an enterprise CRM cut deployment time by 40%." },
  { tag: "meetmux · recommender", value: "95%", label: "Prediction accuracy on a hybrid recommender serving 50K+ concurrent users." },
  { tag: "site service · security", value: "−85%", label: "Vulnerabilities after OAuth 2.0, JWT and OWASP-aligned controls." },
  { tag: "sfsu · gpa", value: "3.95", label: "B.S. Computer Science · Phi Beta Kappa · Dean's List." },
]

export const SKILLS: Record<string, string[]> = {
  languages: ["Python", "TypeScript", "JavaScript", "Java", "C", "C++", "Swift", "Kotlin"],
  "web/mobile": ["React", "Next.js", "React Native", "Node.js", "Express", "FastAPI", "Spring Boot", "Django", "SwiftUI"],
  "ai/agents": ["Claude API", "MCP", "Qdrant", "n8n", "Temporal", "TensorFlow", "PyTorch", "XGBoost", "scikit-learn", "Whisper"],
  "data/cloud": ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "AWS", "Azure", "Docker"],
  "realtime/security": ["REST APIs", "WebSockets", "WebRTC", "OAuth 2.0", "JWT", "OWASP"],
  tools: ["Git", "GitHub Actions", "Linux", "Remotion"],
}

// where each tool actually shows up (from the resume and public repos); unlisted tools show only their group
export const SKILL_NOTES: Record<string, string> = {
  Python: "dex_bridge, resume-agent, public repos",
  JavaScript: "newtonite-swipe, SafeWalk",
  TypeScript: "ConnectX-Mobile, BuzzMe",
  C: "File-System-Project: FAT-style file system and shell",
  Swift: "ServerManager-ios",
  SwiftUI: "ServerManager-ios: SSH server monitoring",
  Kotlin: "cramp-calm: Android vibration patterns",
  React: "Site Service: full-stack migration",
  "Next.js": "this site",
  "React Native": "ConnectX-Mobile: chat client with push notifications",
  "Node.js": "ConnectX: real-time chat server",
  Express: "ConnectX: real-time chat server",
  FastAPI: "resume-agent: resume tailoring service",
  "Spring Boot": "Site Service: legacy migration and 20+ REST APIs",
  "Claude API": "resume-agent: ATS-friendly resume tailoring",
  MCP: "dex_bridge: shared context across LLMs",
  Qdrant: "dex_bridge: local semantic memory store",
  n8n: "SellWizr AI workflows, Auto Reel pipeline",
  Temporal: "SellWizr: AI workflow orchestration",
  TensorFlow: "MeetMux: hybrid recommender, 95% accuracy",
  PyTorch: "MeetMux: hybrid recommender",
  XGBoost: "MeetMux: 60% faster model inference",
  "scikit-learn": "MeetMux: 60% faster model inference",
  Whisper: "transcribe-whisper, ARIA voice assistant",
  PostgreSQL: "Site Service: migration target database",
  Firebase: "Newtonite: product foundation",
  AWS: "Newtonite: primary architecture",
  Azure: "US Neuro: OCR and document workflows",
  Docker: "SellWizr: microservices, deploys 40% faster",
  "REST APIs": "Site Service: 20+ APIs shipped, 30% faster responses",
  WebSockets: "ConnectX and BuzzMe: real-time messaging",
  WebRTC: "dex_call: mobile-first voice calls",
  "OAuth 2.0": "Site Service: 85% fewer vulnerabilities",
  JWT: "Site Service: token management",
  OWASP: "Site Service: compliant security controls",
  "GitHub Actions": "Auto Reel Creation: deployment",
  Remotion: "Auto Reel Creation: automated video pipeline",
}

export const BIO = [
  "Software engineer and CTO focused on system architecture, full-stack products, backend services, workflow automation, and building useful harnesses for AI and agent systems. I like owning things end to end — from the architecture and data flow to the thing that actually ships and runs in production.",
  "Beyond code, I find inspiration in the structure and mystery of the cosmos. Just as space offers infinite frontiers, software development fuels my curiosity with its endless room to build, optimise, and explore.",
]

export const EXPERIENCE = [
  {
    role: "Software Engineer",
    org: "US Neuro",
    where: "",
    period: "Present",
    body: "Designed, built and independently maintain the company's first end-to-end automation system for position-statement preparation, cutting prep from about an hour to 2–3 minutes. Built Azure-based OCR and document-processing workflows (~90% less manual reporting), an internal HR workflow app, and scaled case processing from ~10 to 100 cases/day, supporting a workflow tied to ~$3M in monthly profit.",
  },
  {
    role: "Chief Technology Officer & Co-Founder",
    org: "Newtonite",
    where: "Remote",
    period: "Ongoing",
    body: "Developed the primary architecture and product foundation across AWS and Firebase: service boundaries, data flows and deployment strategy. Own technical direction from architecture through implementation.",
  },
  {
    role: "Software Engineer Intern",
    org: "SellWizr",
    where: "New York, NY",
    period: "Jun 2025 – Dec 2025",
    body: "Engineered Docker-based microservices for an enterprise CRM (−40% deployment time), designed AI workflows with Temporal and n8n (+60% workflow optimization), and drove 98% code coverage with test-driven development.",
  },
  {
    role: "AI/ML Engineer",
    org: "MeetMux",
    where: "Remote",
    period: "Feb 2025 – Jun 2025",
    body: "Architected a hybrid recommendation system with TensorFlow and PyTorch (95% accuracy, 50K+ concurrent users), added deep-learning cold-start handling (+40% new-user engagement), and sped up inference 60% with XGBoost and Scikit-learn.",
  },
  {
    role: "Software Engineer Intern",
    org: "Site Service Software Inc.",
    where: "New York, NY / San Francisco, CA",
    period: "Aug 2024 – Apr 2025",
    body: "Led a full-stack migration to React, Spring Boot and PostgreSQL (+40% performance), implemented OAuth 2.0, JWT and OWASP-compliant security (−85% vulnerabilities), and shipped 20+ REST APIs (−30% response times).",
  },
  {
    role: "Lead Software Engineer",
    org: "Glitter",
    where: "San Francisco, CA",
    period: "Jan 2023 – Dec 2023",
    body: "Led engineering across development teams, guided technical architecture and implementation decisions, and coordinated planning, code quality and delivery.",
  },
]

export const EDUCATION = {
  degree: "B.S. Computer Science",
  org: "San Francisco State University",
  period: "Aug 2021 – Dec 2025",
  body: "GPA 3.95 · Phi Beta Kappa. Coursework: Data Structures, Algorithms, Operating Systems, Databases, Computer Networking.",
}

export const INTERESTS = [
  "astronomy",
  "space exploration",
  "hiking",
  "nature photography",
  "sci-fi",
  "board games",
  "travel",
]

export const PHOTOS = [
  { src: "/photos/IMG_6479.jpeg", title: "Lake Tahoe", date: "Aug 2022", note: "Fall break with friends." },
  { src: "/photos/IMG_5384.jpeg", title: "Weekend in the mountains", date: "Mar 2023", note: "Getaway with friends." },
  { src: "/photos/IMG_6842.jpeg", title: "Museum of Fine Arts", date: "Jun 2023", note: "San Francisco." },
  { src: "/photos/IMG_7111.jpeg", title: "Around campus", date: "Jan 2023", note: "Wandering the university." },
  { src: "/photos/IMG_7241.jpeg", title: "Half Moon Bay", date: "Jul 2022", note: "After dark." },
  { src: "/photos/hike.jpeg", title: "Just a good day", date: "Jul 2022", note: "On the trail." },
]

// Big builds that live in private repos or under an employer. Shown as "private": no links, no code.
export type PrivateWork = { name: string; kind: string; span: string; stack: string[]; note: string }

export const PRIVATE_WORK: PrivateWork[] = [
  { name: "Newtonite platform", kind: "startup · cto", span: "Apr 2026 – now", stack: ["TypeScript", "Kotlin", "AWS", "Firebase"], note: "Backend, candidate screening platform, landing page and an Android screen app. Architecture and deployment owned end to end." },
  { name: "US Neuro case automation", kind: "employer · solo owner", span: "2025 – now", stack: ["Azure", "OCR", "Python"], note: "Position-statement prep cut from about an hour to 2–3 minutes; case volume scaled from ~10 to 100 a day." },
  { name: "DexControl", kind: "personal · self-hosted", span: "Mar – Oct 2026", stack: ["Next.js", "TypeScript", "Kotlin", "WebSockets"], note: "Private web control panel and API for an Android companion app: authenticated device WebSocket, signed-cookie auth, self-hosted." },
  { name: "Server RAG", kind: "personal · infra", span: "Nov 2026", stack: ["Python", "Ollama", "SQLite"], note: "Retrieval service over my own machines' inventory and files; the dashboard chat uses it and shows the sources behind each answer." },
  { name: "ConnectX server", kind: "personal · long-running", span: "Oct 2022 – Dec 2025", stack: ["Node.js", "TypeScript", "WebSockets"], note: "Real-time chat backend behind the public ConnectX-Mobile client. Three years of on-and-off iteration." },
  { name: "Cluzar", kind: "product", span: "May – Aug 2026", stack: ["JavaScript", "HTML"], note: "Web app with its own backend and a separate landing page." },
  { name: "SellWizr CRM", kind: "internship", span: "Jun – Dec 2025", stack: ["Docker", "Temporal", "n8n"], note: "Enterprise CRM microservices (deploys 40% faster) and AI workflows, 98% test coverage." },
  { name: "MeetMux recommender", kind: "contract", span: "Feb – Jun 2025", stack: ["TensorFlow", "PyTorch", "XGBoost"], note: "Hybrid recommender: 95% accuracy at 50K+ concurrent users." },
  { name: "dex-pay", kind: "personal", span: "Jun – Sep 2025", stack: ["TypeScript"], note: "Payments experiment built over a summer." },
]
