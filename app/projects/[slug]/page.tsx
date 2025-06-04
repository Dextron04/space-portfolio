"use client"

import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import type { GitHubRepo as BaseGitHubRepo } from '@/lib/github';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Moon, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Frontmatter {
    title?: string;
    [key: string]: unknown;
}

interface GitHubRepoWithBranch extends BaseGitHubRepo {
    default_branch?: string;
}

// Helper to match slug to repo name
function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

const GITHUB_USERNAME = 'Dextron04';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>('');

    const [state, setState] = useState({
        repo: null as GitHubRepoWithBranch | null,
        defaultBranch: 'main',
        fileContent: '',
        data: {} as Frontmatter,
        content: '',
        found: false,
        loading: true,
        error: ''
    });

    // Resolve params first
    useEffect(() => {
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
        });
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        let isMounted = true;
        (async () => {
            try {
                const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
                if (!reposRes.ok) throw new Error('Could not fetch repos');
                const repos: GitHubRepoWithBranch[] = await reposRes.json();
                const repo = repos.find((r) => toKebabCase(r.name) === slug);
                if (!repo) throw new Error('Repo not found');
                const defaultBranch = repo.default_branch || 'main';
                let fileContent = '';
                let data: Frontmatter = {};
                let content = '';
                let found = false;
                const possiblePaths = [
                    `content/projects/${slug}.md`,
                    'README.md',
                ];
                for (const path of possiblePaths) {
                    const githubRawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${defaultBranch}/${path}`;
                    const res = await fetch(githubRawUrl);
                    if (!res.ok) continue;
                    fileContent = await res.text();
                    const parsed = matter(fileContent);
                    data = parsed.data as Frontmatter;
                    content = parsed.content;
                    found = true;
                    break;
                }
                if (isMounted) {
                    setState({ repo, defaultBranch, fileContent, data, content, found, loading: false, error: found ? '' : 'Project markdown not found.' });
                }
            } catch (err: unknown) {
                let message = 'Project not found.';
                if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
                    message = (err as { message: string }).message;
                }
                if (isMounted) {
                    setState((prev) => ({ ...prev, loading: false, error: message }));
                }
            }
        })();
        return () => { isMounted = false; };
    }, [slug]);

    if (state.loading) {
        return (
            <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden flex items-center justify-center">
                <div className="prose mx-auto py-8 text-center text-gray-300">Loading...</div>
            </div>
        );
    }
    if (state.error) {
        return (
            <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden flex items-center justify-center">
                <div className="prose mx-auto py-8 text-center text-red-500">{state.error}</div>
            </div>
        );
    }
    const { repo, data, content } = state;

    // Early return if repo is null (shouldn't happen due to loading state, but for type safety)
    if (!repo) {
        return (
            <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden flex items-center justify-center">
                <div className="prose mx-auto py-8 text-center text-red-500">Repository not found.</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden">
            {/* Stars background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {[...Array(150)].map((_, i) => (
                    <div key={i} className="star-bg absolute rounded-full bg-white animate-pulse opacity-70" />
                ))}
            </div>

            {/* Header with navigation */}
            <header className="relative z-10 p-4 md:p-6 flex justify-between items-center border-b border-purple-900/30 bg-black/20 backdrop-blur-sm">
                <Link href="/projects" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="hidden sm:inline">Back to Projects</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-purple-400" />
                    <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
                        Project Details
                    </h1>
                </div>
                <div className="w-[72px] sm:w-[100px]"></div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12">
                <section className="mb-10 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6 md:p-10 shadow-lg">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-purple-600 hover:bg-purple-700">{repo.language || 'Other'}</Badge>
                        <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                            {new Date(repo.created_at).getFullYear()}
                        </Badge>
                        {repo.topics && repo.topics.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-indigo-500/50 text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center">
                        <Star className="mr-2 text-purple-400" />
                        {data.title || repo.name}
                    </h2>
                    <div className="prose prose-invert max-w-none text-gray-200">
                        <ReactMarkdown
                            components={{
                                h1: (props) => <h1 className="text-4xl font-extrabold text-purple-300 mb-4" {...props} />,
                                h2: (props) => <h2 className="text-3xl font-bold text-purple-200 mt-8 mb-3" {...props} />,
                                h3: (props) => <h3 className="text-2xl font-semibold text-purple-100 mt-6 mb-2" {...props} />,
                                p: (props) => <p className="mb-4 text-gray-200 leading-relaxed" {...props} />,
                                a: (props) => <a className="text-purple-400 underline hover:text-purple-200 transition" target="_blank" rel="noopener noreferrer" {...props} />,
                                ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
                                ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                                li: (props) => <li className="mb-1" {...props} />,
                                strong: (props) => <strong className="font-bold text-white" {...props} />,
                                code: (props) => <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-300 font-mono" {...props} />,
                                img: (props) => (
                                    <Image
                                        src={(props.src as string) || ''}
                                        alt={props.alt || ''}
                                        width={800}
                                        height={400}
                                        className="rounded-lg shadow-lg my-4 mx-auto max-w-full"
                                        style={{ height: 'auto', width: '100%' }}
                                    />
                                ),
                                blockquote: (props) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />,
                                hr: (props) => <hr className="my-8 border-purple-900/30" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                    <div className="flex justify-end pt-6">
                        <Button
                            variant="outline"
                            className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                            asChild
                        >
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                View on GitHub
                            </a>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 border-t border-purple-900/30 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex justify-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Tushin Kulshreshtha. All projects and their assets are protected by copyright.
                </div>
            </footer>
        </div>
    );
}
