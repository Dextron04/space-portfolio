"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { Body, Engine } from "matter-js"
import { SKILLS, SKILL_NOTES } from "@/lib/profile"

const EASE = [0.2, 0, 0, 1] as const
type Tool = { name: string; group: string }
const TOOLS: Tool[] = Object.entries(SKILLS).flatMap(([group, items]) => items.map((name) => ({ name, group })))
const GROUPS = Object.keys(SKILLS)

const tileBase =
  "border border-b-2 border-line bg-surface text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] select-none whitespace-nowrap font-medium tracking-tight"

function Caption({ active, hint }: { active: Tool | null; hint: string }) {
  return (
    <div className="mt-5 min-h-[3.25rem] border-t border-line pt-4 font-mono text-[13px]" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={active?.name ?? "idle"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: EASE }}
          className="text-dim"
        >
          {active ? (
            <>
              <span className="text-faint">$ man </span>
              <span className="text-fg">{active.name}</span>
              <span className="text-faint"> — </span>
              {SKILL_NOTES[active.name] ?? active.group}
            </>
          ) : (
            <span className="text-faint">
              $ {hint}
              <span className="cursor ml-1.5" />
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function Chips({ group, setGroup, children }: { group: string | null; setGroup: (g: string | null) => void; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Highlight tools by group">
      <button className="chip" aria-pressed={group === null} onClick={() => setGroup(null)}>all</button>
      {GROUPS.map((g) => (
        <button key={g} className="chip" aria-pressed={group === g} onClick={() => setGroup(group === g ? null : g)}>
          {g}
        </button>
      ))}
      {children}
    </div>
  )
}

/* ---------- static fallback: reduced motion / before JS ---------- */
function StaticGrid() {
  const [group, setGroup] = useState<string | null>(null)
  const [active, setActive] = useState<Tool | null>(null)
  return (
    <div>
      <Chips group={group} setGroup={setGroup} />
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {TOOLS.map((t) => (
          <li key={t.name}>
            <button
              onClick={() => setActive(t)}
              onFocus={() => setActive(t)}
              className={`${tileBase} h-12 w-full px-3 text-left text-[15px] transition-opacity duration-300 ${group && t.group !== group ? "opacity-25" : ""}`}
            >
              {t.name}
            </button>
          </li>
        ))}
      </ul>
      <Caption active={active} hint="tap a tool to see where I've used it" />
    </div>
  )
}

/* ---------- the toy: tools fall into a box; drag, throw, shake ---------- */
function Pile() {
  const box = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLButtonElement | null)[]>([])
  const api = useRef<{ shake: () => void; drop: () => void; lit: (g: string | null) => void; pop: (i: number) => void } | null>(null)
  const [group, setGroup] = useState<string | null>(null)
  const [active, setActive] = useState<Tool | null>(null)
  const [ready, setReady] = useState(false)
  const justDragged = useRef(false)

  useEffect(() => {
    const el = box.current!
    let stop = false
    let raf = 0
    let visible = false
    let engine: Engine
    let cleanup = () => {}

    ;(async () => {
      const Matter = (await import("matter-js")).default
      if (stop) return
      const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter
      const W = () => el.clientWidth
      const H = el.clientHeight
      engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1.1

      // thick walls so a fast throw can't tunnel through
      const floor = Bodies.rectangle(0, H + 200, 6000, 400, { isStatic: true })
      const left = Bodies.rectangle(-200, 0, 400, H * 6, { isStatic: true })
      const right = Bodies.rectangle(W() + 200, 0, 400, H * 6, { isStatic: true })
      Body.setPosition(floor, { x: W() / 2, y: H + 200 })
      Composite.add(engine.world, [floor, left, right])

      const sizes = tiles.current.map((t) => [t!.offsetWidth, t!.offsetHeight] as const)
      const bodies: Body[] = sizes.map(([w, h], i) =>
        Bodies.rectangle(
          w / 2 + 6 + Math.random() * Math.max(1, W() - w - 12),
          -40 - i * 34,
          w,
          h,
          { restitution: 0.28, friction: 0.5, frictionAir: 0.012, chamfer: { radius: 3 }, angle: (Math.random() - 0.5) * 0.9, sleepThreshold: 40 }
        )
      )
      Composite.add(engine.world, bodies)

      const draw = () => {
        bodies.forEach((b, i) => {
          const t = tiles.current[i]!
          const [w, h] = sizes[i]
          t.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
        })
      }
      let last = 0
      const tick = (now: number) => {
        raf = 0
        if (stop || !visible) return
        const dt = Math.min(32, last ? now - last : 16)
        last = now
        Engine.update(engine, dt)
        // safety: cap speed, and rescue anything that still escapes the box
        for (const b of bodies) {
          const v = b.velocity
          const sp = Math.hypot(v.x, v.y)
          if (sp > 32) Body.setVelocity(b, { x: (v.x / sp) * 32, y: (v.y / sp) * 32 })
          const { x, y } = b.position
          if (x < -10 || x > W() + 10 || y > H + 30) {
            Body.setPosition(b, { x: Math.min(Math.max(x, 40), W() - 40), y: Math.min(y, H - 30) })
            Body.setVelocity(b, { x: 0, y: 0 })
          }
        }
        draw()
        if (bodies.some((b) => !b.isSleeping) || dragging) raf = requestAnimationFrame(tick)
        else last = 0
      }
      const wake = () => {
        bodies.forEach((b) => Sleeping.set(b, false))
        if (!raf && visible) raf = requestAnimationFrame(tick)
      }

      /* drag & throw with a mouse; touch keeps native scroll and uses tap-to-pop */
      let dragging: { c: Matter.Constraint; id: number; x: number; y: number } | null = null
      const rel = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        return { x: e.clientX - r.left, y: e.clientY - r.top }
      }
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "touch") return
        const i = tiles.current.findIndex((t) => t === e.target || t?.contains(e.target as Node))
        if (i < 0) return
        const b = bodies[i]
        const p = rel(e)
        Sleeping.set(b, false)
        dragging = {
          id: e.pointerId,
          x: p.x,
          y: p.y,
          c: Constraint.create({
            pointA: p,
            bodyB: b,
            pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
            stiffness: 0.1,
            damping: 0.2,
            length: 0,
          }),
        }
        Composite.add(engine.world, dragging.c)
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        if (!raf) raf = requestAnimationFrame(tick)
      }
      const onMove = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== dragging.id) return
        const p = rel(e)
        dragging.c.pointA = p
        if (Math.hypot(p.x - dragging.x, p.y - dragging.y) > 5) justDragged.current = true
      }
      const onUp = (e: PointerEvent) => {
        if (!dragging || e.pointerId !== dragging.id) return
        Composite.remove(engine.world, dragging.c)
        dragging = null
        if (!raf) raf = requestAnimationFrame(tick)
      }
      el.addEventListener("pointerdown", onDown)
      addEventListener("pointermove", onMove)
      addEventListener("pointerup", onUp)
      addEventListener("pointercancel", onUp)

      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(tick)
      })
      io.observe(el)
      const ro = new ResizeObserver(() => {
        Body.setPosition(right, { x: W() + 200, y: 0 })
        Body.setPosition(floor, { x: W() / 2, y: H + 200 })
        wake()
      })
      ro.observe(el)

      const kick = (b: Body, up: number, side: number) => {
        Sleeping.set(b, false)
        Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * side * b.mass, y: -up * b.mass * (0.6 + Math.random() * 0.6) })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.25)
      }
      api.current = {
        shake: () => {
          bodies.forEach((b) => kick(b, 0.07, 0.05))
          wake()
        },
        drop: () => {
          bodies.forEach((b, i) => {
            Sleeping.set(b, false)
            Body.setVelocity(b, { x: 0, y: 0 })
            Body.setPosition(b, { x: sizes[i][0] / 2 + 6 + Math.random() * Math.max(1, W() - sizes[i][0] - 12), y: -40 - i * 34 })
          })
          wake()
        },
        lit: (g) => {
          bodies.forEach((b, i) => {
            const on = g !== null && TOOLS[i].group === g
            tiles.current[i]!.dataset.lit = on ? "1" : ""
            tiles.current[i]!.dataset.dim = g !== null && !on ? "1" : ""
            if (on) kick(b, 0.05, 0.02)
          })
          wake()
        },
        pop: (i) => {
          kick(bodies[i], 0.09, 0.04)
          wake()
        },
      }
      draw()
      setReady(true)
      cleanup = () => {
        el.removeEventListener("pointerdown", onDown)
        removeEventListener("pointermove", onMove)
        removeEventListener("pointerup", onUp)
        removeEventListener("pointercancel", onUp)
        io.disconnect()
        ro.disconnect()
        Composite.clear(engine.world, false)
        Engine.clear(engine)
      }
    })()

    return () => {
      stop = true
      cancelAnimationFrame(raf)
      cleanup()
    }
  }, [])

  const choose = useCallback((g: string | null) => {
    setGroup(g)
    api.current?.lit(g)
  }, [])

  return (
    <div>
      <Chips group={group} setGroup={choose}>
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
        <button className="chip" onClick={() => api.current?.shake()} disabled={!ready}>shake ⇡</button>
        <button className="chip" onClick={() => api.current?.drop()} disabled={!ready}>drop again ↓</button>
      </Chips>

      <div
        ref={box}
        role="group"
        aria-label="Tools. Drag them around, or press one for details."
        className="relative h-[620px] overflow-hidden border border-line bg-surface/40 sm:h-[360px]"
        style={{ touchAction: "pan-y" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-fg/20" />
        {TOOLS.map((t, i) => (
          <button
            key={t.name}
            ref={(n) => {
              tiles.current[i] = n
            }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(t)}
            onFocus={() => setActive(t)}
            onClick={() => {
              setActive(t)
              if (justDragged.current) justDragged.current = false
              else api.current?.pop(i)
            }}
            className={`${tileBase} absolute left-0 top-0 h-9 cursor-grab px-3 text-[13px] transition-[opacity,border-color,background-color] duration-300 will-change-transform hover:border-faint active:cursor-grabbing data-[dim]:opacity-25 data-[lit]:border-fg/80 data-[lit]:bg-bg`}
            style={{ transform: "translate(-200px, -200px)" }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <Caption active={active} hint="grab a tool, throw it, shake the box" />
    </div>
  )
}

export default function Toolbox() {
  const calm = useReducedMotion()
  const [mode, setMode] = useState<"static" | "pile">("static")
  useEffect(() => {
    if (!calm) setMode("pile")
  }, [calm])
  return mode === "pile" ? <Pile /> : <StaticGrid />
}
