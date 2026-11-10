// Live commit calendar across personal + org repos (incl. private). Token is server-only (GITHUB_TOKEN in ~/Services/portfolio/.env).
// Same logic as scripts/contributions.mjs; result cached in memory for an hour.
export const dynamic = "force-dynamic"

const EMAILS = ["tueshin12@gmail.com", "tushink04@gmail.com"]
const ORGS = ["newtonitehq", "knullifyhq"]
const TZ = "America/Los_Angeles"
const TTL = 60 * 60 * 1000
const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4)
const localDay = (t: string | number) => new Date(t).toLocaleDateString("en-CA", { timeZone: TZ })

type Payload = { total: number; days: { date: string; count: number; level: number; repos: [string, number][] }[] }
let cache: { at: number; data: Payload } | null = null
let inflight: Promise<Payload> | null = null

const gh = (path: string) =>
  fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    cache: "no-store",
  })

async function pages<T>(path: string): Promise<T[]> {
  const out: T[] = []
  for (let page = 1; ; page++) {
    const res = await gh(`${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`)
    if (res.status === 409) return out // empty repo
    if (!res.ok) throw new Error(`${path} ${res.status}`)
    const rows: T[] = await res.json()
    out.push(...rows)
    if (rows.length < 100) return out
  }
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]) }))
}

async function build(): Promise<Payload> {
  const since = new Date(Date.now() - 365 * 864e5).toISOString()
  type R = { full_name: string; name: string; fork: boolean }
  const lists = await Promise.all([
    pages<R>("/user/repos?affiliation=owner&sort=pushed"),
    ...ORGS.map((o) => pages<R>(`/orgs/${o}/repos`)),
  ])
  const repos = lists.flat().filter((r) => !r.fork)
  const by: Record<string, Record<string, number>> = {}
  await pool(repos, 10, async (r) => {
    for (const email of EMAILS) {
      const rows = await pages<{ commit: { author: { date: string } } }>(
        `/repos/${r.full_name}/commits?author=${encodeURIComponent(email)}&since=${since}`
      ).catch(() => [])
      for (const c of rows) {
        const day = (by[localDay(c.commit.author.date)] ??= {})
        day[r.name] = (day[r.name] || 0) + 1
      }
    }
  })
  const days: Payload["days"] = []
  for (let t = Date.now() - 364 * 864e5; t <= Date.now(); t += 864e5) {
    const date = localDay(t)
    const rs = Object.entries(by[date] || {}).sort((a, b) => b[1] - a[1])
    const count = rs.reduce((s, r) => s + r[1], 0)
    days.push({ date, count, level: level(count), repos: rs })
  }
  return { total: days.reduce((s, d) => s + d.count, 0), days }
}

export async function GET() {
  if (!process.env.GITHUB_TOKEN) return Response.json({ error: "no token" }, { status: 503 })
  const fresh = cache && Date.now() - cache.at < TTL
  if (!fresh && !inflight) {
    inflight = build()
      .then((data) => (cache = { at: Date.now(), data }).data)
      .finally(() => (inflight = null))
  }
  try {
    // serve stale while refreshing; first request waits for the build
    const data = cache ? cache.data : await inflight!
    return Response.json(data, { headers: { "Cache-Control": "public, max-age=300" } })
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 })
  }
}
