"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type * as THREE from "three"
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

/* ---------- the toy: a skill atom. Groups are tilted orbits, tools are electrons ---------- */
function Atom({ onFail }: { onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<{ focus: (g: string | null) => void; excite: () => void } | null>(null)
  const [group, setGroup] = useState<string | null>(null)
  const [active, setActive] = useState<Tool | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = host.current!
    let stop = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import("three")
      if (stop) return
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        onFail()
        return
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%"
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
      const root = new THREE.Group()
      scene.add(root)

      /* labels as sprites: canvas pill textures, normal + hot */
      const toDispose: { dispose: () => void }[] = []
      const label = (text: string, hot: boolean, faint = false) => {
        const c = document.createElement("canvas")
        const g = c.getContext("2d")!
        const font = `500 ${faint ? 24 : 30}px ui-monospace, SFMono-Regular, Menlo, monospace`
        g.font = font
        const w = Math.ceil(g.measureText(text).width) + (faint ? 20 : 44)
        const h = faint ? 40 : 64
        c.width = w
        c.height = h
        g.font = font
        g.textBaseline = "middle"
        g.textAlign = "center"
        if (!faint) {
          g.fillStyle = hot ? "rgba(245,245,247,0.96)" : "rgba(10,11,13,0.92)"
          g.strokeStyle = hot ? "rgba(255,255,255,1)" : "rgba(180,180,190,0.45)"
          g.lineWidth = 3
          g.beginPath()
          g.roundRect(2, 2, w - 4, h - 4, 12)
          g.fill()
          g.stroke()
        }
        g.fillStyle = hot ? "#0a0b0d" : faint ? "rgba(138,143,152,0.8)" : "#d9d9dc"
        g.fillText(text, w / 2, h / 2 + 1)
        const tex = new THREE.CanvasTexture(c)
        tex.colorSpace = THREE.SRGBColorSpace
        toDispose.push(tex)
        return { tex, ratio: w / h }
      }

      const narrow = () => el.clientWidth < 640
      const labelH = () => (narrow() ? 0.85 : 0.56)

      /* nucleus */
      const nucleus = new THREE.Group()
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), new THREE.MeshBasicMaterial({ color: 0xf5f5f7 }))
      const cage = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.0, 1)),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
      )
      nucleus.add(core, cage)
      root.add(nucleus)
      toDispose.push(core.geometry, cage.geometry, core.material as THREE.Material, cage.material as THREE.Material)

      /* orbits */
      type Electron = { tool: Tool; sprite: InstanceType<typeof THREE.Sprite>; normal: THREE.Texture; hot: THREE.Texture; ratio: number; a: number; g: number; hover: number; pop: number; fade: number }
      const electrons: Electron[] = []
      const orbits = GROUPS.map((name, gi) => {
        const n = new THREE.Vector3()
        const y = 1 - ((gi + 0.5) / GROUPS.length) * 2
        const r = Math.sqrt(1 - y * y)
        n.set(Math.cos(gi * 2.399963) * r, y, Math.sin(gi * 2.399963) * r)
        const orbit = new THREE.Group()
        orbit.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
        const R = 2.3 + gi * 0.72
        const pts: THREE.Vector3[] = []
        for (let i = 0; i <= 128; i++) {
          const t = (i / 128) * Math.PI * 2
          pts.push(new THREE.Vector3(Math.cos(t) * R, 0, Math.sin(t) * R * 0.92))
        }
        const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }))
        orbit.add(line)
        toDispose.push(line.geometry, line.material as THREE.Material)

        const tag = label(name, false, true)
        const tagSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tag.tex, transparent: true, opacity: 0.9, depthWrite: false }))
        tagSprite.position.set(R, 0, 0)
        tagSprite.scale.set(0.42 * tag.ratio, 0.42, 1)
        tagSprite.userData.tag = true
        orbit.add(tagSprite)
        toDispose.push(tagSprite.material)

        const tools = TOOLS.filter((t) => t.group === name)
        tools.forEach((tool, i) => {
          const normal = label(tool.name, false)
          const hot = label(tool.name, true)
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: normal.tex, transparent: true, depthWrite: false }))
          sprite.userData.index = electrons.length
          orbit.add(sprite)
          toDispose.push(sprite.material)
          electrons.push({ tool, sprite, normal: normal.tex, hot: hot.tex, ratio: normal.ratio, a: (i / tools.length) * Math.PI * 2 + gi, g: gi, hover: 0, pop: 0, fade: 1 })
        })
        root.add(orbit)
        return { name, orbit, line, R, speed: (gi % 2 ? -1 : 1) * (0.5 / Math.sqrt(R)), tag: tagSprite, lit: 1 }
      })

      /* sizing */
      const resize = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        // fit the outer orbit: needs ~12 world units across the smaller screen axis
        const span = 12.4
        const fov = (camera.fov * Math.PI) / 180
        camera.position.set(0, 0, Math.max(span / 2 / Math.tan(fov / 2) / Math.min(1, camera.aspect), 9))
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      /* interaction */
      const ray = new THREE.Raycaster()
      const mouse = new THREE.Vector2(9, 9)
      let pointerIn = false
      let hover = -1
      let drag: { id: number; x: number; y: number; moved: boolean } | null = null
      const spin = new THREE.Vector2(0, 0.12) // rad/s: x = about Y, y = about X
      let focusQ: THREE.Quaternion | null = null
      let litGroup = -1
      let boost = 0
      const qa = new THREE.Quaternion()
      const ax = new THREE.Vector3()
      const pick = () => {
        ray.setFromCamera(mouse, camera)
        const h = ray.intersectObjects([...electrons.map((e) => e.sprite), core])[0]
        return !h ? -1 : h.object === core ? -2 : (h.object.userData.index as number)
      }
      const setMouse = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      }
      const onMove = (e: PointerEvent) => {
        setMouse(e)
        pointerIn = true
        if (drag && e.pointerId === drag.id) {
          const dx = e.clientX - drag.x
          const dy = e.clientY - drag.y
          if (Math.hypot(dx, dy) > 3) drag.moved = true
          if (drag.moved) {
            focusQ = null
            spin.set(dx * 0.012, dy * 0.012)
            ax.set(0, 1, 0)
            qa.setFromAxisAngle(ax, dx * 0.008)
            root.quaternion.premultiply(qa)
            ax.set(1, 0, 0)
            qa.setFromAxisAngle(ax, dy * 0.008)
            root.quaternion.premultiply(qa)
            drag.x = e.clientX
            drag.y = e.clientY
          }
        }
      }
      const onDown = (e: PointerEvent) => {
        setMouse(e)
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
        if (e.pointerType !== "touch") el.setPointerCapture?.(e.pointerId)
        spin.set(0, 0)
      }
      const onUp = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return
        const moved = drag.moved
        drag = null
        if (moved) return
        setMouse(e)
        const i = pick()
        if (i === -2) {
          boost = 1
          setActive(null)
        } else if (i >= 0) {
          electrons[i].pop = 1
          setActive(electrons[i].tool)
        }
      }
      const onLeave = () => {
        pointerIn = false
        mouse.set(9, 9)
      }
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerdown", onDown)
      addEventListener("pointerup", onUp)
      el.addEventListener("pointerleave", onLeave)

      api.current = {
        focus: (g) => {
          litGroup = g ? GROUPS.indexOf(g) : -1
          if (litGroup >= 0) {
            const n = new THREE.Vector3(0, 1, 0).applyQuaternion(orbits[litGroup].orbit.quaternion)
            focusQ = new THREE.Quaternion().setFromUnitVectors(n, new THREE.Vector3(0, 0, 1))
          } else focusQ = null
        },
        excite: () => {
          boost = 1
        },
      }

      /* loop: only while on screen */
      let visible = false
      let raf = 0
      let last = 0
      const clock = (now: number) => {
        raf = 0
        if (stop || !visible) return
        const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
        last = now
        const t = now / 1000

        // rotation: inertia, then gentle idle spin; focus tween wins
        if (focusQ) root.quaternion.slerp(focusQ, 1 - Math.exp(-dt * 4))
        else if (!drag) {
          spin.multiplyScalar(Math.exp(-dt * 2.2))
          const idle = pointerIn ? 0 : 0.1
          ax.set(0, 1, 0)
          qa.setFromAxisAngle(ax, (spin.x + idle) * dt)
          root.quaternion.premultiply(qa)
          ax.set(1, 0, 0)
          qa.setFromAxisAngle(ax, spin.y * dt)
          root.quaternion.premultiply(qa)
        }

        // hover
        const next = pointerIn && !drag?.moved ? pick() : -1
        if (next !== hover) {
          hover = next
          el.style.cursor = hover === -1 ? (drag?.moved ? "grabbing" : "grab") : "pointer"
          if (hover >= 0) setActive(electrons[hover].tool)
        }

        boost *= Math.exp(-dt * 1.6)
        const pulse = 1 + 0.06 * Math.sin(t * 2) + boost * 0.5
        nucleus.scale.setScalar(pulse)
        cage.rotation.y += dt * (0.4 + boost * 4)
        cage.rotation.x += dt * 0.2

        orbits.forEach((o, gi) => {
          const target = litGroup === -1 || litGroup === gi ? 1 : 0.12
          o.lit += (target - o.lit) * (1 - Math.exp(-dt * 8))
          ;(o.line.material as THREE.LineBasicMaterial).opacity = (litGroup === gi ? 0.8 : 0.3) * (0.4 + 0.6 * o.lit)
          ;(o.tag.material as THREE.SpriteMaterial).opacity = 0.9 * o.lit
        })

        electrons.forEach((e, i) => {
          const o = orbits[e.g]
          const slow = 1 - 0.9 * e.hover
          e.a += o.speed * dt * (1 + boost * 5) * slow
          e.hover += ((hover === i ? 1 : 0) - e.hover) * (1 - Math.exp(-dt * 10))
          e.pop = Math.max(0, e.pop - dt * 1.4)
          const bump = Math.sin(e.pop * Math.PI) * 0.9 + e.hover * 0.25
          const rr = o.R + bump
          e.sprite.position.set(Math.cos(e.a) * rr, 0, Math.sin(e.a) * rr * 0.92)
          const m = e.sprite.material as THREE.SpriteMaterial
          const hot = hover === i
          const want = hot ? e.hot : e.normal
          if (m.map !== want) {
            m.map = want
            m.needsUpdate = true
          }
          e.fade += (o.lit - e.fade) * (1 - Math.exp(-dt * 8))
          m.opacity = Math.max(0.1, e.fade)
          const k = labelH() * (1 + e.hover * 0.35 + Math.sin(e.pop * Math.PI) * 0.3)
          e.sprite.scale.set(k * e.ratio, k, 1)
        })

        renderer.render(scene, camera)
        raf = requestAnimationFrame(clock)
      }
      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting
        if (visible && !raf) {
          last = 0
          raf = requestAnimationFrame(clock)
        }
      })
      io.observe(el)
      setReady(true)

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerdown", onDown)
        removeEventListener("pointerup", onUp)
        el.removeEventListener("pointerleave", onLeave)
        toDispose.forEach((d) => d.dispose())
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      stop = true
      cleanup()
    }
  }, [onFail])

  const choose = useCallback((g: string | null) => {
    setGroup(g)
    setActive(null)
    api.current?.focus(g)
  }, [])

  return (
    <div>
      <Chips group={group} setGroup={choose}>
        <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
        <button className="chip" onClick={() => api.current?.excite()} disabled={!ready}>excite</button>
      </Chips>
      <div
        ref={host}
        role="img"
        aria-label="Interactive 3D atom: each orbit is a skill group and each electron is a tool. Drag to rotate, hover an electron for details, click the nucleus to excite it."
        className="relative h-[520px] cursor-grab overflow-hidden border border-line bg-surface/40 sm:h-[620px]"
        style={{ touchAction: "pan-y" }}
      />
      <Caption active={active} hint="drag to spin the atom · hover an electron · click the nucleus" />
    </div>
  )
}

export default function Toolbox() {
  const calm = useReducedMotion()
  const [mode, setMode] = useState<"static" | "atom">("static")
  const fail = useCallback(() => setMode("static"), [])
  useEffect(() => {
    if (!calm) setMode("atom")
  }, [calm])
  return mode === "atom" ? <Atom onFail={fail} /> : <StaticGrid />
}
