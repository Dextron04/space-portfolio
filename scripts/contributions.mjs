// Snapshot of commit counts per day across every repo you can reach (personal + orgs), matched by author email.
// Run: node scripts/contributions.mjs   (needs `gh auth login` with repo + read:org)
import { execFileSync } from "node:child_process"
import { writeFileSync } from "node:fs"

const EMAILS = ["tueshin12@gmail.com", "tushink04@gmail.com"]
const OWNERS = ["Dextron04", "newtonitehq", "knullifyhq"]
const since = new Date(Date.now() - 365 * 864e5).toISOString()
// GitHub buckets commits by your local day, not UTC
const TZ = "America/Los_Angeles"
const localDay = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ })
const gh = (...a) => execFileSync("gh", a, { encoding: "utf8", maxBuffer: 1 << 28 })

const repos = OWNERS.flatMap((o) =>
  JSON.parse(gh("repo", "list", o, "--limit", "300", "--json", "nameWithOwner,isFork")).filter((r) => !r.isFork).map((r) => r.nameWithOwner)
)
const by = {} // date -> { repo: commits }
for (const repo of repos)
  for (const email of EMAILS) {
    try {
      const out = gh("api", "--paginate", `repos/${repo}/commits?author=${encodeURIComponent(email)}&since=${since}&per_page=100`, "--jq", ".[].commit.author.date")
      for (const d of out.split("\n").filter(Boolean)) {
        const day = (by[localDay(d)] ??= {})
        const name = repo.split("/")[1]
        day[name] = (day[name] || 0) + 1
      }
    } catch {} // empty repos 409
  }

const days = []
for (let t = Date.now() - 364 * 864e5; t <= Date.now(); t += 864e5) {
  const date = localDay(t)
  const repos = Object.entries(by[date] || {}).sort((a, b) => b[1] - a[1])
  const count = repos.reduce((s, r) => s + r[1], 0)
  days.push({ date, count, repos, level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4 })
}
const total = days.reduce((s, d) => s + d.count, 0)
writeFileSync("public/contributions.json", JSON.stringify({ total, days }))
console.log(`${repos.length} repos, ${total} commits`)
