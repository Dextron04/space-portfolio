"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Github, Linkedin, Mail, Moon, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Portfolio() {
  const [text, setText] = useState("")
  const [fullText] = useState("Tushin Kulshreshtha") // Replace with your name
  const [index, setIndex] = useState(0)
  const [stars] = useState(() =>
    [...Array(100)].map(() => ({
      width: Math.random() * 3 + 1 + "px",
      height: Math.random() * 3 + 1 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: Math.random() * 5 + 3,
    }))
  )

  // Typewriter effect
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prevText) => prevText + fullText[index])
        setIndex((prevIndex) => prevIndex + 1)
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [index, fullText])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: star.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating planets */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-900 opacity-30"
        animate={{
          y: [0, 10, 0],
          rotate: 360,
        }}
        transition={{
          y: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/5 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 opacity-20"
        animate={{
          y: [0, -15, 0],
          rotate: 360,
        }}
        transition={{
          y: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          rotate: { duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="text-purple-300" />
            <span className="font-bold text-xl">Portfolio</span>
          </div>
          <div className="hidden md:flex gap-6">
            <Link href="#about" className="hover:text-purple-300 transition-colors">
              About
            </Link>
            <Link href="#projects" className="hover:text-purple-300 transition-colors">
              Projects
            </Link>
            <Link href="#skills" className="hover:text-purple-300 transition-colors">
              Skills
            </Link>
            <Link href="#contact" className="hover:text-purple-300 transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-purple-300">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-purple-300">
              <Linkedin className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        <div className="text-center px-4">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
              {text}
            </span>
            <span className="animate-pulse">|</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-8">Software Developer & Space Enthusiast</h2>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">View My Work</Button>
        </div>

        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </header>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4 md:px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
          <Star className="mr-2 text-purple-400" /> About Me
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-gray-300">
              Hello! I&apos;m a passionate developer with a love for creating beautiful, functional websites and
              applications. Just like the vast universe, my curiosity is endless, and I&apos;m always exploring new
              technologies and approaches.
            </p>
            <p className="text-gray-300">
              With experience in frontend and backend development, I craft digital experiences that are both visually
              stunning and technically sound. When I&apos;m not coding, you might find me stargazing or reading about the
              latest advancements in space exploration.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Quick Facts</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span> Based in New York, USA
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> 5+ years of development experience
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> Specialized in React, Next.js, and Node.js
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> Worked with startups and enterprise companies
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> Computer Science degree from Tech University
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-4 md:px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
          <Star className="mr-2 text-purple-400" /> My Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((project) => (
            <Card key={project} className="bg-slate-900/60 border-purple-900/50 backdrop-blur-sm overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-indigo-800/20 to-purple-800/20 flex items-center justify-center">
                <Image
                  src={`/placeholder.svg?height=200&width=400`}
                  alt={`Project ${project}`}
                  className="object-cover"
                  layout="fill"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white">Project {project}</CardTitle>
                <CardDescription className="text-gray-400">A brief description of this amazing project</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  This project showcases my skills in React, Next.js, and Tailwind CSS. It features a responsive design
                  and interactive elements.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                  View Demo
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-purple-300">
                  <Github className="h-5 w-5 mr-2" /> Code
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-4 md:px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
          <Star className="mr-2 text-purple-400" /> My Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "GraphQL", "MongoDB"].map(
            (skill) => (
              <div
                key={skill}
                className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 p-4 rounded-lg border border-purple-800/30 backdrop-blur-sm text-center"
              >
                <div className="text-lg font-medium text-gray-200">{skill}</div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4 md:px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
          <Star className="mr-2 text-purple-400" /> Contact Me
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-gray-300">
              Interested in working together? Feel free to reach out to me through any of the channels below. I&apos;m always
              open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="text-purple-400" />
              <span>hello@johndoe.com</span>
            </div>
            <div className="flex gap-4 mt-6">
              <Button className="bg-purple-600 hover:bg-purple-700">Send Message</Button>
              <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/30">
                Download Resume
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-slate-800/70 border border-purple-900/50 rounded-md p-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-slate-800/70 border border-purple-900/50 rounded-md p-2 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-slate-800/70 border border-purple-900/50 rounded-md p-2 text-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-slate-800/70 border border-purple-900/50 rounded-md p-2 text-white"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-purple-900/30 mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Tushin Kulshreshtha. All rights reserved.</div>
          <div className="flex gap-6 text-gray-400">
            <Link href="#" className="hover:text-purple-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-purple-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

