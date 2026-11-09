import ScrambleText from "./ScrambleText"

export default function SectionHead({ n, path, title }: { n: string; path: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="label mb-3 flex items-center gap-3">
        <span className="text-accent">{n}</span>
        <span>{path}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="font-sans font-medium tracking-tight text-4xl leading-none md:text-6xl">
        <ScrambleText text={title} onView />
      </h2>
    </div>
  )
}
