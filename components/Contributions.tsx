"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { AsciiReveal, AsciiSkeleton } from "ascii-reveal"
import { asciiTheme } from "./ProjectGrid"
import { LINKS } from "@/lib/profile"

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4; repos?: [string, number][] }
type Data = { total: number; days: Day[] }

const USER = "Dextron04"
const CELL = 11
const GAP = 3
const OPACITY = [0.07, 0.28, 0.5, 0.75, 1]
const DELAY = 900 // ms the skeleton stays up after the graph scrolls into view, so the decode is seen
let cache: Data | null = null

const fmt = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

// Snapshot from scripts/contributions.mjs (public + private + org repos); public calendar as fallback.
export default function Contributions() {
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, margin: "0px 0px -20% 0px" })
  const [data, setData] = useState<Data | null>(cache)
  const [failed, setFailed] = useState(false)
  const [armed, setArmed] = useState(false)
  const [tip, setTip] = useState<Day | null>(null)

  useEffect(() => {
    if (cache) return
    let live = true
    fetch("/contributions.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .catch(() =>
        fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((j) => ({ total: j.total.lastYear, days: j.contributions }))
      )
      .then((d: Data) => {
        cache = d
        live && setData(d)
      })
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setArmed(true), DELAY)
    return () => clearTimeout(t)
  }, [inView])

  if (failed)
    return (
      <p className="text-dim">
        Couldn&apos;t load the graph. See it on{" "}
        <a href={LINKS.github} className="text-accent underline underline-offset-4">github.com/{USER}</a>.
      </p>
    )

  const ready = armed && !!data
  const days = data?.days ?? []
  const lead = days.length ? new Date(days[0].date + "T00:00:00Z").getUTCDay() : 0 // first column starts on Sunday
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...days]
  const cols = Math.ceil(cells.length / 7) || 53
  const width = cols * (CELL + GAP) - GAP
  const height = 7 * (CELL + GAP) - GAP

  return (
    <div ref={box}>
      <AsciiReveal loading={!ready} preset="terminal" style={asciiTheme}>
        {!ready ? (
          <div className="min-h-[300px]" aria-busy="true">
            <AsciiSkeleton variant="terminal" lines={1} widths={["34%"]} seed={5} />
            <div className="mt-5">
              <AsciiSkeleton variant="terminal" lines={7} seed={9} />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[12px] text-dim">
              <span>
                <span className="text-fg">{data!.total.toLocaleString()}</span> commits in the last year
              </span>
              <span className="text-faint">public + private repos</span>
            </div>
            <div className="overflow-x-auto pb-2">
              <svg
                width="100%"
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={`${data!.total} commits in the last year across public and private repositories`}
                className="min-w-[640px]"
                onMouseLeave={() => setTip(null)}
              >
                {cells.map((d, i) =>
                  d ? (
                    <rect
                      key={i}
                      x={Math.floor(i / 7) * (CELL + GAP)}
                      y={(i % 7) * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={2}
                      fill="rgb(var(--fg))"
                      fillOpacity={OPACITY[d.level]}
                      stroke={tip?.date === d.date ? "rgb(var(--fg))" : "none"}
                      onMouseEnter={() => setTip(d)}
                      onClick={() => setTip(d)}
                    />
                  ) : null
                )}
              </svg>
            </div>

            {/* terminal readout for the hovered day */}
            <div className="mt-3 min-h-[116px] rounded-md border border-line bg-surface/60 p-4 font-mono text-[12px] leading-relaxed" aria-live="polite">
              {tip ? (
                <>
                  <p className="text-dim">
                    <span className="text-faint">$</span> git log --since={tip.date} --until={tip.date}
                  </p>
                  <p className="mt-1 text-fg">
                    {fmt(tip.date)} · {tip.count} commit{tip.count === 1 ? "" : "s"}
                  </p>
                  {tip.repos?.length ? (
                    <ul className="mt-1 text-dim">
                      {tip.repos.slice(0, 4).map(([name, n]) => (
                        <li key={name}>
                          ├ {name} <span className="text-faint">×{n}</span>
                        </li>
                      ))}
                      {tip.repos.length > 4 && <li className="text-faint">└ +{tip.repos.length - 4} more</li>}
                    </ul>
                  ) : (
                    <p className="mt-1 text-faint">{tip.count ? "" : "no commits"}</p>
                  )}
                </>
              ) : (
                <p className="text-faint">
                  <span>$</span> hover a square to see what I worked on<span className="cursor" />
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-faint">
              less
              {OPACITY.map((o) => (
                <span key={o} className="inline-block h-[10px] w-[10px] rounded-[2px] bg-fg" style={{ opacity: o }} />
              ))}
              more
            </div>
          </div>
        )}
      </AsciiReveal>
    </div>
  )
}
