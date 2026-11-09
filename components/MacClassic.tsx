"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const NAME = "tushin kulshreshtha"

// Loads the SVG inline so its keys can be clicked. Each click types the next letter of the name on the CRT.
export default function MacClassic() {
  const host = useRef<HTMLDivElement>(null)
  const pos = useRef(0)
  const [markup, setMarkup] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch("/mac-classic.svg")
      .then((r) => r.text())
      .then((t) => live && setMarkup(t))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  const onClick = (e: React.MouseEvent) => {
    const key = (e.target as Element).closest<SVGGElement>("[data-key]")
    const svg = host.current?.querySelector("svg")
    if (!key || !svg) return

    // key goes down for 110ms
    const [dx, dy] = (svg.getAttribute("data-down") ?? "0 0").split(" ").map(Number)
    key.setAttribute("transform", `translate(${dx} ${dy})`)
    key.setAttribute("data-down", "")
    setTimeout(() => {
      key.removeAttribute("transform")
      key.removeAttribute("data-down")
    }, 110)

    // screen: each click types the next letter; wraps to a second line after the space
    const idle = svg.querySelector<SVGGElement>('[data-part="idle"]')!
    const typed = svg.querySelector<SVGGElement>('[data-part="typed"]')!
    const t1 = svg.querySelector<SVGTextElement>('[data-part="typed1"]')!
    const t2 = svg.querySelector<SVGTextElement>('[data-part="typed2"]')!
    const cursor = svg.querySelector<SVGRectElement>('[data-part="typedcursor"]')!
    pos.current = pos.current >= NAME.length ? 1 : pos.current + 1
    const first = NAME.indexOf(" ")
    t1.textContent = "> " + NAME.slice(0, Math.min(pos.current, first))
    t2.textContent = pos.current > first ? NAME.slice(first + 1, pos.current) : ""
    const line = pos.current > first ? t2 : t1
    cursor.setAttribute("x", String(Number(line.getAttribute("x")) + line.getComputedTextLength() + 0.5))
    cursor.setAttribute("y", String(Number(line.getAttribute("y")) - 5))
    idle.style.display = "none"
    typed.style.display = ""
  }

  return (
    <div className="mx-auto w-full max-w-[460px]">
      {markup ? (
        <div
          ref={host}
          onClick={onClick}
          role="img"
          aria-label="Isometric 1990s Macintosh with a keyboard. Click keys and the screen types tushin kulshreshtha, one letter per click."
          className="[&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      ) : (
        <Image src="/mac-classic.svg" alt="Isometric illustration of a 1990s Macintosh" width={460} height={480} unoptimized priority className="h-auto w-full" />
      )}
      <p className="mt-2 text-center font-mono text-[12px] text-faint">click the keys</p>
    </div>
  )
}
