"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Filter, Github, Layers, Moon, Search, Star, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Project, fetchGitHubProjects } from "@/lib/github"
import { toKebabCase } from '@/lib/utils'

const GITHUB_USERNAME = "Dextron04"

const FEATURED_PROJECT_IDS = [817924934, 715984514, 924062761, 943776958, 933837207]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 12

  // Fetch projects from GitHub
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true)
      try {
        const fetchedProjects = await fetchGitHubProjects(GITHUB_USERNAME)
        console.log('All project IDs:', fetchedProjects.map(project => ({ name: project.name, id: project.id })))

        // Mark featured projects
        const projectsWithFeatured = fetchedProjects.map(project => ({
          ...project,
          featured: FEATURED_PROJECT_IDS.includes(project.id)
        }))

        setProjects(projectsWithFeatured)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Extract all unique tags and categories
  const allTags = Array.from(new Set(projects.flatMap((project) => project.topics)))
  const allCategories = Array.from(new Set(projects.map((project) => project.language || 'Other')))
  const allYears = Array.from(new Set(projects.map((project) => new Date(project.created_at).getFullYear()))).sort((a, b) => b - a)

  // Filter projects based on search, category, tags, and year
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = selectedCategory ? (project.language || 'Other') === selectedCategory : true
    const matchesTags = selectedTags.length > 0 ? selectedTags.every((tag) => project.topics.includes(tag)) : true
    const matchesYear = selectedYear ? new Date(project.created_at).getFullYear() === selectedYear : true

    return matchesSearch && matchesCategory && matchesTags && matchesYear
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage)

  // Handle project selection and modal
  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedTags([])
    setSelectedYear(null)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading projects...</p>
          </div>
        </div>
      </div>
    )
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
        <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
            My Projects
          </h1>
        </div>
        <div className="w-[72px] sm:w-[100px]"></div> {/* Responsive spacer */}
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
        {/* Featured projects section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Star className="mr-2 text-purple-400" /> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <motion.div
                  key={project.id}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900/80 to-indigo-900/50 border border-purple-800/30 h-[300px]"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openProjectModal(project)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">{project.language || 'Other'}</Badge>
                    <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{project.description || 'No description available'}</p>
                  </div>
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {project.topics.slice(0, 2).map((topic) => (
                      <Badge key={topic} variant="outline" className="bg-black/50 border-purple-500/50">
                        {topic}
                      </Badge>
                    ))}
                    {project.topics.length > 2 && (
                      <Badge variant="outline" className="bg-black/50 border-purple-500/50">
                        +{project.topics.length - 2}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Filters and search section */}
        <section className="mb-10 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-4 md:p-6">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/70 border-purple-900/50 text-white"
              />
            </div>

            {/* Filter buttons */}
            <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                    <Filter className="h-4 w-4 mr-2" /> Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-purple-800">
                  <DropdownMenuItem
                    className={`cursor-pointer hover:bg-purple-900/30 ${!selectedCategory ? "text-purple-400 font-medium" : "text-gray-200"}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {allCategories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      className={`cursor-pointer hover:bg-purple-900/30 ${selectedCategory === category ? "text-purple-400 font-medium" : "text-gray-200"}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                    <Tag className="h-4 w-4 mr-2" /> Tags
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-purple-800">
                  {allTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag}
                      className={`cursor-pointer hover:bg-purple-900/30 ${selectedTags.includes(tag) ? "text-purple-400 font-medium" : "text-gray-200"}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag} {selectedTags.includes(tag) && "✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                    Year
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-purple-800">
                  <DropdownMenuItem
                    className={`cursor-pointer hover:bg-purple-900/30 ${!selectedYear ? "text-purple-400 font-medium" : "text-gray-200"}`}
                    onClick={() => setSelectedYear(null)}
                  >
                    All Years
                  </DropdownMenuItem>
                  {allYears.map((year) => (
                    <DropdownMenuItem
                      key={year}
                      className={`cursor-pointer hover:bg-purple-900/30 ${selectedYear === year ? "text-purple-400 font-medium" : "text-gray-200"}`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" className="text-purple-300 hover:text-purple-200" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            {/* Active filters display */}
            {(selectedCategory || selectedTags.length > 0 || selectedYear) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-900/50 hover:bg-purple-900/70"
                    onClick={() => setSelectedCategory(null)}
                  >
                    {selectedCategory} ×
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-indigo-900/50 hover:bg-indigo-900/70"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
                {selectedYear && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-900/50 hover:bg-blue-900/70"
                    onClick={() => setSelectedYear(null)}
                  >
                    {selectedYear} ×
                  </Badge>
                )}
              </div>
            )}

            {/* View mode toggle and count */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-purple-900/30">
              <p className="text-gray-400 text-sm">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className={
                    viewMode === "grid" ? "bg-purple-600 hover:bg-purple-700" : "border-purple-700 text-purple-300"
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className={
                    viewMode === "list" ? "bg-purple-600 hover:bg-purple-700" : "border-purple-700 text-purple-300"
                  }
                  onClick={() => setViewMode("list")}
                >
                  <Layers className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* All projects section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Star className="mr-2 text-purple-400" /> All Projects
          </h2>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30">
              <p className="text-xl text-gray-400">No projects match your filters</p>
              <Button
                variant="outline"
                className="mt-4 border-purple-700 text-purple-300 hover:bg-purple-900/30"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 overflow-hidden"
                      onClick={() => openProjectModal(project)}
                    >
                      <div className="h-48 overflow-hidden">
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(project.languages || {}).map((lang) => (
                              <Badge key={lang} className="bg-purple-600 hover:bg-purple-700">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                          <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                            {new Date(project.created_at).getFullYear()}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">{project.description || 'No description available'}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.topics.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-indigo-500/50 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Link href={`/projects/${toKebabCase(project.name)}`} passHref legacyBehavior>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                              onClick={e => e.stopPropagation()}
                            >
                              Details
                            </Button>
                          </Link>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-purple-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.html_url, "_blank")
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-purple-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.git_url, "_blank")
                              }}
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 overflow-hidden"
                      onClick={() => openProjectModal(project)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <div className="relative aspect-video overflow-hidden rounded-lg">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="p-6 md:w-3/4">
                          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                            <div className="flex gap-2 items-center">
                              <div className="flex flex-wrap gap-2">
                                {Object.keys(project.languages || {}).map((lang) => (
                                  <Badge key={lang} className="bg-purple-600 hover:bg-purple-700">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                              <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                                {new Date(project.created_at).getFullYear()}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(project.html_url, "_blank")
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(project.git_url, "_blank")
                                }}
                              >
                                <Github className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                          <p className="text-gray-300 mb-4">{project.description || 'No description available'}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.topics.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-indigo-500/50 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Link href={`/projects/${toKebabCase(project.name)}`} passHref legacyBehavior>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-purple-700 text-purple-300 hover:bg-purple-900/30 mt-2"
                              onClick={e => e.stopPropagation()}
                            >
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}

          {/* Pagination Controls */}
          {filteredProjects.length > projectsPerPage && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`${currentPage === page
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-purple-700 text-purple-300 hover:bg-purple-900/30"
                      }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Project count */}
          <div className="mt-4 text-center text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + projectsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
          </div>
        </section>
      </main>

      {/* Project detail modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-purple-900/50 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold">{selectedProject.name}</DialogTitle>
                  <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300">
                    {new Date(selectedProject.created_at).getFullYear()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(selectedProject.languages || {}).map((lang) => (
                    <Badge key={lang} className="bg-purple-600 hover:bg-purple-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
                <DialogDescription className="text-gray-400 mt-2">{selectedProject.description || 'No description available'}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden h-[300px]">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={selectedProject.image || "/placeholder.svg"}
                      alt={selectedProject.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-300">{selectedProject.description || 'No description available'}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.topics.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-indigo-500/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-purple-900/30">
                  <Button
                    variant="outline"
                    className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                    onClick={() => window.open(selectedProject.html_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> View on GitHub
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-purple-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Your Name. All projects and their assets are protected by copyright.
        </div>
      </footer>
    </div>
  )
}

