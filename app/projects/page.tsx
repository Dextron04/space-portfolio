"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Filter, Github, Layers, Moon, Search, Star, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample project data - replace with your actual projects
const projectsData = [
  {
    id: 1,
    title: "Cosmic Weather App",
    description: "A weather application with space-themed UI that shows forecasts based on NASA satellite data.",
    longDescription:
      "This weather application combines real-time weather data with NASA satellite imagery to create a unique cosmic experience. Users can view weather patterns as if they were observing Earth from space, with additional features like aurora forecasts and space weather alerts.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Node.js", "NASA API"],
    category: "Web Application",
    featured: true,
    demoLink: "#",
    githubLink: "#",
    year: 2023,
  },
  {
    id: 2,
    title: "Stellar Portfolio Generator",
    description: "A tool that helps developers create space-themed portfolios with minimal configuration.",
    longDescription:
      "Stellar Portfolio Generator is a comprehensive tool designed for developers who want to showcase their work with a cosmic twist. It features customizable templates, space-themed animations, and an intuitive dashboard for managing projects and skills.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["TypeScript", "Next.js", "Tailwind CSS"],
    category: "Developer Tool",
    featured: true,
    demoLink: "#",
    githubLink: "#",
    year: 2023,
  },
  {
    id: 3,
    title: "Orbit - Task Management",
    description: "A task management system where tasks orbit around projects like planets around stars.",
    longDescription:
      "Orbit revolutionizes task management by visualizing projects as solar systems. Each project is a star with tasks orbiting around it based on priority and deadline. The interactive UI allows users to drag and rearrange tasks, with animations that follow the laws of orbital mechanics.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Firebase", "Framer Motion"],
    category: "Productivity",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2022,
  },
  {
    id: 4,
    title: "Nebula Chat",
    description: "End-to-end encrypted messaging app with a cosmic UI and constellation-based user networks.",
    longDescription:
      "Nebula Chat is a secure messaging platform that uses advanced encryption to protect user communications. The UI represents users as stars forming constellations of connections. Messages travel through animated 'cosmic dust' pathways, and group chats form their own nebulae.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React Native", "GraphQL", "Encryption"],
    category: "Mobile App",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2022,
  },
  {
    id: 5,
    title: "Astro Analytics",
    description: "A data visualization dashboard that presents analytics in a cosmic-themed interface.",
    longDescription:
      "Astro Analytics transforms boring data into celestial visualizations. Charts and graphs are styled as constellations, galaxies, and cosmic phenomena. The dashboard adapts to data patterns, showing 'supernovas' for traffic spikes and 'black holes' for conversion drops.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Vue.js", "D3.js", "Python"],
    category: "Data Visualization",
    featured: true,
    demoLink: "#",
    githubLink: "#",
    year: 2021,
  },
  {
    id: 6,
    title: "Pulsar - Music Visualizer",
    description: "A music visualizer that creates cosmic animations based on audio frequencies and beats.",
    longDescription:
      "Pulsar analyzes audio in real-time to generate stunning space-themed visualizations. Bass frequencies might form black holes, while high notes create star clusters. Users can customize the cosmic elements and color schemes, and even record their visualizations to share online.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["JavaScript", "Web Audio API", "Canvas"],
    category: "Entertainment",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2021,
  },
  {
    id: 7,
    title: "Galactic E-commerce",
    description: "A full-featured e-commerce platform with a space exploration theme for product discovery.",
    longDescription:
      "Galactic E-commerce reimagines online shopping as space exploration. Product categories are solar systems, and products are planets users can visit and explore. The checkout process is visualized as a journey back to the user's home planet, with animations for each step.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Node.js", "MongoDB"],
    category: "E-commerce",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2020,
  },
  {
    id: 8,
    title: "Quantum Code Editor",
    description: "A code editor with a space-time theme that visualizes code execution in a cosmic environment.",
    longDescription:
      "Quantum Code Editor visualizes code as matter flowing through space-time. Functions are represented as gravity wells, loops as orbits, and variables as celestial bodies. The editor includes features like time-travel debugging (visualized as actual time travel) and parallel execution views.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Electron", "TypeScript", "WebGL"],
    category: "Developer Tool",
    featured: true,
    demoLink: "#",
    githubLink: "#",
    year: 2020,
  },
  {
    id: 9,
    title: "Constellation - Social Network",
    description: "A social network where user connections form constellations and content appears as cosmic events.",
    longDescription:
      "Constellation is a unique social platform where users are stars in a vast digital universe. Connections between users form constellations, and content shared appears as cosmic events like supernovas or meteor showers. The more engagement a post receives, the brighter and more visible its cosmic representation becomes.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "GraphQL", "AWS"],
    category: "Social Media",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2019,
  },
  {
    id: 10,
    title: "Interstellar Blog Platform",
    description: "A blogging platform where each blog is a planet and posts are locations to explore.",
    longDescription:
      "Interstellar Blog Platform transforms blogging into planetary exploration. Each blog is a unique planet with its own atmosphere (theme) and geography (categories). Blog posts are locations on these planets that readers can discover and explore. Comments appear as settlements that grow around popular locations.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "Prisma", "PostgreSQL"],
    category: "Content Management",
    featured: false,
    demoLink: "#",
    githubLink: "#",
    year: 2019,
  },
]

// Extract all unique tags and categories
const allTags = Array.from(new Set(projectsData.flatMap((project) => project.tags)))
const allCategories = Array.from(new Set(projectsData.map((project) => project.category)))
const allYears = Array.from(new Set(projectsData.map((project) => project.year))).sort((a, b) => b - a)

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProject, setSelectedProject] = useState<(typeof projectsData)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter projects based on search, category, tags, and year
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? project.category === selectedCategory : true
    const matchesTags = selectedTags.length > 0 ? selectedTags.every((tag) => project.tags.includes(tag)) : true
    const matchesYear = selectedYear ? project.year === selectedYear : true

    return matchesSearch && matchesCategory && matchesTags && matchesYear
  })

  // Handle project selection and modal
  const openProjectModal = (project: (typeof projectsData)[0]) => {
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

  // Stars background effect
  useEffect(() => {
    const stars = document.querySelectorAll(".star-bg")
    stars.forEach((star) => {
      const size = Math.random() * 3 + 1
      const duration = Math.random() * 5 + 3

      star.setAttribute(
        "style",
        `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-duration: ${duration}s;
      `,
      )
    })
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div key={i} className="star-bg absolute rounded-full bg-white animate-pulse opacity-70" />
        ))}
      </div>

      {/* Header with navigation */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-purple-900/30">
        <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Moon className="text-purple-300" />
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Featured projects section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Star className="mr-2 text-purple-400" /> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData
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
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <Badge className="mb-2 bg-purple-600 hover:bg-purple-700">{project.category}</Badge>
                    <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-black/50 border-purple-500/50">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 2 && (
                      <Badge variant="outline" className="bg-black/50 border-purple-500/50">
                        +{project.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Filters and search section */}
        <section className="mb-10 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/70 border-purple-900/50 text-white"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                    <Filter className="h-4 w-4 mr-2" /> Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-purple-800">
                  <DropdownMenuItem
                    className={!selectedCategory ? "text-purple-400" : ""}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {allCategories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      className={selectedCategory === category ? "text-purple-400" : ""}
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
                      className={selectedTags.includes(tag) ? "text-purple-400" : ""}
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
                    className={!selectedYear ? "text-purple-400" : ""}
                    onClick={() => setSelectedYear(null)}
                  >
                    All Years
                  </DropdownMenuItem>
                  {allYears.map((year) => (
                    <DropdownMenuItem
                      key={year}
                      className={selectedYear === year ? "text-purple-400" : ""}
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
          </div>

          {/* Active filters display */}
          {(selectedCategory || selectedTags.length > 0 || selectedYear) && (
            <div className="flex flex-wrap gap-2 mb-4">
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

          {/* View mode toggle */}
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Showing {filteredProjects.length} of {projectsData.length} projects
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
                  {filteredProjects.map((project) => (
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
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-purple-600 hover:bg-purple-700">{project.category}</Badge>
                          <Badge variant="outline" className="border-purple-500/50">
                            {project.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-indigo-500/50 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                          >
                            Details
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-purple-300"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.demoLink, "_blank")
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
                                window.open(project.githubLink, "_blank")
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
                  {filteredProjects.map((project) => (
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
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-3/4">
                          <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                            <div className="flex gap-2 items-center">
                              <Badge className="bg-purple-600 hover:bg-purple-700">{project.category}</Badge>
                              <Badge variant="outline" className="border-purple-500/50">
                                {project.year}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-purple-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(project.demoLink, "_blank")
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
                                  window.open(project.githubLink, "_blank")
                                }}
                              >
                                <Github className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-gray-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="border-indigo-500/50 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* Project detail modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-purple-900/50 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                  <Badge variant="outline" className="border-purple-500/50">
                    {selectedProject.year}
                  </Badge>
                </div>
                <DialogDescription className="text-gray-400">{selectedProject.category}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden h-[300px]">
                  <img
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-300">{selectedProject.longDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
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
                    onClick={() => window.open(selectedProject.demoLink, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
                    onClick={() => window.open(selectedProject.githubLink, "_blank")}
                  >
                    <Github className="h-4 w-4 mr-2" /> View Code
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

