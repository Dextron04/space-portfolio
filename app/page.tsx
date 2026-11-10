"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"

import ProjectGrid from "@/components/ProjectGrid"
import MacClassic from "@/components/MacClassic"
import Toolbox from "@/components/Toolbox"
import Reveal from "@/components/Reveal"
import ScrambleText from "@/components/ScrambleText"
import Stats from "@/components/Stats"
import Contributions from "@/components/Contributions"
import PrivateWork from "@/components/PrivateWork"
import SectionHead from "@/components/SectionHead"
import { FEATURED_PROJECT_IDS, useProjects } from "@/lib/useProjects"
import { FACTS, LINKS } from "@/lib/profile"

const EASE = [0.2, 0, 0, 1] as const
const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 },
})

export default function Home() {
  const projects = useProjects()
  const featured = (projects?.filter((p) => p.featured) ?? []).sort(
    (a, b) => FEATURED_PROJECT_IDS.indexOf(a.id) - FEATURED_PROJECT_IDS.indexOf(b.id)
  )

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* hero */}
      <section className="grid min-h-[calc(100vh-3.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <motion.p {...rise(0)} className="mb-6 font-mono text-dim">
            <span className="text-accent">$</span> whoami
          </motion.p>
          <h1 className="font-sans font-medium tracking-tight text-[clamp(2.75rem,8.5vw,6.75rem)] leading-[0.88] tracking-tight">
            <ScrambleText text="Tushin" delay={250} />
            <br />
            <em className="not-italic text-faint">
              <ScrambleText text="Kulshreshtha" delay={500} />
            </em>
          </h1>
          <motion.p {...rise(3)} className="mt-8 max-w-xl text-base text-dim md:text-lg">
            Software engineer. I build secure, scalable backend, cloud and ML systems — and care a lot about clean
            architecture.
          </motion.p>
          <motion.div {...rise(4)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-solid">view work →</Link>
            <a href={LINKS.resume} download className="btn">resume ↓</a>
            <Link href="/about" className="btn">about</Link>
          </motion.div>
        </div>

        <motion.div {...rise(5)} className="relative">
          <MacClassic />
        </motion.div>

        <a href="#about" aria-label="Scroll to about" className="hidden items-center gap-2 text-faint transition-colors hover:text-fg lg:flex lg:col-span-2">
          <ArrowDown size={14} className="animate-nudge" /> scroll
        </a>
      </section>

      {/* about */}
      <section id="about" className="scroll-mt-20 py-24">
        <SectionHead n="01" path="~/about" title="Numbers, not adjectives" />
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-4 text-dim">
            <p>
              Software engineer in San Francisco who likes owning a system end to end — backend services, cloud
              infrastructure, ML, and the automation that ties them together. Four-plus years across startups and
              enterprise teams, in Python, Java, JavaScript and C.
            </p>
            <p>
              I&apos;ve shipped Docker microservices on AWS, secure REST APIs and auth, and recommenders serving 50K+
              users, and I&apos;m CTO and co-founder of Newtonite. Right now I&apos;m at US Neuro, automating
              case workflows with Azure and AI.
            </p>
            <Link href="/about" className="inline-block text-accent underline underline-offset-4">
              full story →
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
<div className="border border-line bg-surface/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-faint" />
            <span className="h-2 w-2 rounded-full bg-faint" />
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="label ml-2">~/profile.json</span>
          </div>
          <dl className="space-y-3 p-5 font-mono text-[13px]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3">
                <dt className="text-faint">{k}</dt>
                <dd className="text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
          </Reveal>
        </div>
        <div className="mt-16">
          <Stats />
        </div>
      </section>

      {/* newtonite spotlight */}
      <section id="newtonite" className="scroll-mt-20 py-24">
        <SectionHead n="02" path="~/newtonite" title="Co-founder & CTO" />
        <Reveal className="grid overflow-hidden border border-line bg-surface/60 md:grid-cols-[minmax(220px,300px)_1fr]">
          <div className="flex items-center justify-center border-b border-line bg-black p-8 md:border-b-0 md:border-r">
            <Image src="/newtonite.svg" alt="Newtonite logo: a serif N with a small atom" width={240} height={240} unoptimized className="h-auto w-full max-w-[240px]" />
          </div>
          <div className="flex flex-col p-6 md:p-10">
            <p className="label">cto &amp; co-founder · ongoing</p>
            <h3 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Newtonite</h3>
            <p className="mt-5 max-w-xl text-dim">
              I&apos;m the technical lead of a company I co-founded: the person who decides how the product is built and
              then builds it. The balance I care about is product requirements against engineering trade-offs and
              long-term system evolution.
            </p>
            <dl className="mt-8 divide-y divide-line border-y border-line font-mono text-[13px]">
              {[
                ["architecture", "Primary architecture and product foundation across AWS and Firebase"],
                ["systems", "Service boundaries, data flows and deployment strategy"],
                ["ownership", "Technical direction, from architecture through implementation"],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                  <dt className="text-faint">{k}</dt>
                  <dd className="text-fg/90">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {["AWS", "Firebase", "system architecture", "product engineering"].map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* skills */}
      <section id="skills" className="scroll-mt-20 py-24">
        <SectionHead n="03" path="~/skills" title="Toolbox" />
        <Toolbox />
      </section>

      {/* work */}
      <section id="work" className="scroll-mt-20 py-24">
        <SectionHead n="04" path="~/projects --featured" title="Selected work" />
        {projects?.length === 0 ? (
          <p className="text-dim">
            Couldn&apos;t reach GitHub right now. Browse on{" "}
            <a href={LINKS.github} className="text-accent underline underline-offset-4">github.com/Dextron04</a>.
          </p>
        ) : (
          <ProjectGrid projects={projects && featured} skeletons={6} />
        )}
        <Link href="/projects" className="btn mt-8">all projects →</Link>
      </section>

      {/* activity */}
      <section id="activity" className="scroll-mt-20 py-24">
        <SectionHead n="05" path="~/activity" title="Commit history" />
        <Reveal><Contributions /></Reveal>
      </section>

      {/* private work */}
      <section id="private" className="scroll-mt-20 py-24">
        <SectionHead n="06" path="~/private" title="Closed-source work" />
        <p className="mb-8 max-w-2xl text-dim">
          The bigger, longer builds don&apos;t live on my public GitHub. Listed here so they&apos;re not invisible; code and links are private.
        </p>
        <PrivateWork />
      </section>

      {/* contact */}
      <section id="contact" className="scroll-mt-20 py-24">
        <SectionHead n="07" path="~/contact" title="Let's build something" />
        <Reveal className="flex flex-wrap gap-3">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="btn"><Github size={15} /> github</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="btn"><Linkedin size={15} /> linkedin</a>
          <a href={LINKS.email} className="btn"><Mail size={15} /> email</a>
          <a href={LINKS.resume} download className="btn btn-solid">resume ↓</a>
        </Reveal>
      </section>
    </div>
  )
}
