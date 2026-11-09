import { AsciiSkeleton } from "ascii-reveal"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24">
      <AsciiSkeleton variant="terminal" lines={1} widths={["30%"]} />
      <div className="mt-10"><AsciiSkeleton variant="terminal" lines={8} /></div>
    </div>
  )
}
