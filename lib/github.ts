export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    topics: string[];
    stargazers_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    fork: boolean;
    private: boolean;
    default_branch?: string;
}

export interface Project extends GitHubRepo {
    featured?: boolean;
}

// One paginated call to the public API; no token, nothing secret in the client bundle.
// (Unauthenticated limit is 60 req/hr per IP — plenty for 1–2 calls per visit.)
export async function fetchGitHubProjects(username: string): Promise<Project[]> {
    try {
        const all: GitHubRepo[] = [];
        for (let page = 1; ; page++) {
            const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`);
            if (!res.ok) throw new Error(`GitHub API ${res.status}`);
            const repos: GitHubRepo[] = await res.json();
            all.push(...repos);
            if (repos.length < 100) break;
        }
        return all.filter((r) => !r.fork && !r.private);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        return [];
    }
}
