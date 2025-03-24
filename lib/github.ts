export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    git_url: string;
    url: string;  // API URL for the repository
    homepage: string | null;
    topics: string[];
    stargazers_count: number;
    language: string | null;  // Primary language
    languages_url: string;    // URL to fetch all languages
    created_at: string;
    updated_at: string;
    fork: boolean;
    private: boolean;
}

export interface Project extends GitHubRepo {
    featured?: boolean;
    longDescription?: string;
    image?: string;
    languages?: { [key: string]: number };  // Map of language names to bytes of code
}

async function getReadmeImage(username: string, repo: string, defaultBranch: string): Promise<string | null> {
    try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const readmeUrl = `https://raw.githubusercontent.com/${username}/${repo}/${defaultBranch}/README.md?t=${timestamp}`;
        console.log(`\n=== Processing ${repo} ===`);
        console.log(`Fetching README from: ${readmeUrl}`);

        // Try to fetch README.md
        const response = await fetch(readmeUrl);
        console.log(`Response status for ${repo}:`, response.status);

        if (!response.ok) {
            console.log(`README.md not found for ${repo}, trying README.mdc`);
            // Try README.mdc
            const mdcUrl = `https://raw.githubusercontent.com/${username}/${repo}/${defaultBranch}/README.mdc?t=${timestamp}`;
            console.log(`Trying README.mdc from: ${mdcUrl}`);
            const responseMdc = await fetch(mdcUrl);
            console.log(`README.mdc response status for ${repo}:`, responseMdc.status);

            if (!responseMdc.ok) {
                console.log(`No README found for ${repo}`);
                return null;
            }
            const content = await responseMdc.text();
            console.log(`README.mdc content length for ${repo}:`, content.length);
            console.log(`First 500 chars of README.mdc for ${repo}:`, content.substring(0, 500));

            // Look for any markdown image
            const markdownMatches = content.matchAll(/!\[([^\]]+)\]\(([^)]+)\)/g);
            const markdownResults = Array.from(markdownMatches);
            console.log(`\nAll markdown images found in ${repo}:`);
            markdownResults.forEach((match, index) => {
                console.log(`${index + 1}. Alt text: "${match[1]}"`);
                console.log(`   URL: ${match[2]}`);
            });

            // Look for any HTML img tag with src attribute
            const htmlMatches = content.matchAll(/<img[^>]*src="([^"]*)"[^>]*>/g);
            const htmlResults = Array.from(htmlMatches);
            console.log(`\nAll HTML images found in ${repo}:`);
            htmlResults.forEach((match, index) => {
                console.log(`${index + 1}. URL: ${match[1]}`);
            });

            // Return the first image found
            if (markdownResults.length > 0) {
                console.log(`\nUsing first markdown image for ${repo}:`, markdownResults[0][2]);
                return markdownResults[0][2];
            }
            if (htmlResults.length > 0) {
                console.log(`\nUsing first HTML image for ${repo}:`, htmlResults[0][1]);
                return htmlResults[0][1];
            }
            console.log(`\nNo images found for ${repo}`);
            return null;
        }

        const content = await response.text();
        console.log(`README.md content length for ${repo}:`, content.length);
        console.log(`First 500 chars of README.md for ${repo}:`, content.substring(0, 500));

        // Look for any markdown image
        const markdownMatches = content.matchAll(/!\[([^\]]+)\]\(([^)]+)\)/g);
        const markdownResults = Array.from(markdownMatches);
        console.log(`\nAll markdown images found in ${repo}:`);
        markdownResults.forEach((match, index) => {
            console.log(`${index + 1}. Alt text: "${match[1]}"`);
            console.log(`   URL: ${match[2]}`);
        });

        // Look for any HTML img tag with src attribute
        const htmlMatches = content.matchAll(/<img[^>]*src="([^"]*)"[^>]*>/g);
        const htmlResults = Array.from(htmlMatches);
        console.log(`\nAll HTML images found in ${repo}:`);
        htmlResults.forEach((match, index) => {
            console.log(`${index + 1}. URL: ${match[1]}`);
        });

        // Return the first image found
        if (markdownResults.length > 0) {
            console.log(`\nUsing first markdown image for ${repo}:`, markdownResults[0][2]);
            return markdownResults[0][2];
        }
        if (htmlResults.length > 0) {
            console.log(`\nUsing first HTML image for ${repo}:`, htmlResults[0][1]);
            return htmlResults[0][1];
        }
        console.log(`\nNo images found for ${repo}`);
        return null;
    } catch (error) {
        console.error(`Error fetching README for ${repo}:`, error);
        return null;
    }
}

async function getRepoLanguages(username: string, repo: string, headers: HeadersInit): Promise<{ [key: string]: number }> {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/languages`, {
            headers,
        });

        if (!response.ok) {
            console.error(`Failed to fetch languages for ${repo}:`, response.status);
            return {};
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching languages for ${repo}:`, error);
        return {};
    }
}

export async function fetchGitHubProjects(username: string): Promise<Project[]> {
    try {
        console.log('Fetching GitHub projects for:', username);

        if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
            console.error('GitHub token not found in environment variables');
            throw new Error('GitHub token is required');
        }

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        };

        // First, let's verify the token works by making a test call
        const testResponse = await fetch('https://api.github.com/user', { headers });
        console.log('Token test response status:', testResponse.status);
        if (!testResponse.ok) {
            const errorText = await testResponse.text();
            console.error('Token test failed:', errorText);
            throw new Error(`GitHub API authentication failed: ${testResponse.status} ${errorText}`);
        }

        let allRepos: GitHubRepo[] = [];
        let page = 1;
        let hasMore = true;

        // Fetch all pages of repositories
        while (hasMore) {
            console.log(`Fetching page ${page} of repositories...`);
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`,
                { headers }
            );

            if (!response.ok) {
                console.error('GitHub API error:', response.status, response.statusText);
                if (response.status === 403) {
                    console.error('Rate limit exceeded. Please add a GitHub token to increase the rate limit.');
                }
                throw new Error('Failed to fetch GitHub projects');
            }

            const repos: GitHubRepo[] = await response.json();

            // If we got less than 100 repos, this is the last page
            if (repos.length < 100) {
                hasMore = false;
            }

            allRepos = [...allRepos, ...repos];
            console.log(`Found ${repos.length} repos on page ${page}. Total so far: ${allRepos.length}`);

            page++;
        }

        console.log(`Total repos found: ${allRepos.length}`);

        // Process all non-fork, non-private repos
        const projects = await Promise.all(
            allRepos
                .filter(repo => !repo.fork && !repo.private)
                .map(async repo => {
                    try {
                        console.log(`Processing repo: ${repo.name}`);

                        // Get the default branch
                        const repoResponse = await fetch(repo.url, {
                            headers,
                        });

                        if (!repoResponse.ok) {
                            console.error(`Failed to fetch repo details for ${repo.name}:`, repoResponse.status);
                            if (repoResponse.status === 403) {
                                console.error('Rate limit exceeded. Please add a GitHub token to increase the rate limit.');
                            }
                            return {
                                ...repo,
                                featured: false,
                                longDescription: repo.description || 'No description available',
                                image: '/placeholder.svg?height=400&width=600',
                                languages: {},
                            };
                        }

                        const repoData = await repoResponse.json();
                        const defaultBranch = repoData.default_branch;
                        console.log(`Default branch for ${repo.name}: ${defaultBranch}`);

                        // Fetch languages
                        const languages = await getRepoLanguages(username, repo.name, headers);
                        console.log(`Languages for ${repo.name}:`, languages);

                        // Try to get the image, but don't fail if it doesn't work
                        let image = null;
                        try {
                            image = await getReadmeImage(username, repo.name, defaultBranch);
                            console.log(`Found image for ${repo.name}:`, image);
                        } catch (imageError) {
                            console.error(`Error getting image for ${repo.name}:`, imageError);
                        }

                        return {
                            ...repo,
                            featured: false,
                            longDescription: repo.description || 'No description available',
                            image: image || '/placeholder.svg?height=400&width=600',
                            languages,
                        };
                    } catch (error) {
                        console.error(`Error processing repo ${repo.name}:`, error);
                        // Return a basic project object even if there's an error
                        return {
                            ...repo,
                            featured: false,
                            longDescription: repo.description || 'No description available',
                            image: '/placeholder.svg?height=400&width=600',
                            languages: {},
                        };
                    }
                })
        );

        console.log(`Successfully processed ${projects.length} projects`);
        return projects;
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        return [];
    }
} 