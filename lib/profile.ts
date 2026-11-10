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
