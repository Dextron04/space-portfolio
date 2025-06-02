"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Github, Linkedin, Moon, Star } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ASCIIText from "@/components/ASCIIText"
import ContactForm from "@/components/ContactForm"
import SkillsSection from "@/components/SkillsSection"

type Star = {
  width: string;
  height: string;
  top: string;
  left: string;
  duration: number;
};

export default function Portfolio() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      [...Array(100)].map(() => ({
        width: Math.random() * 3 + 1 + "px",
        height: Math.random() * 3 + 1 + "px",
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        duration: Math.random() * 5 + 3,
      }))
    )
  }, [])

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
        <nav className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <Moon className="text-purple-400 h-5 w-5" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">Portfolio</span>
          </div>
          <div className="hidden md:flex gap-6">
            <Link href="/about" className="hover:text-purple-300 transition-colors">
              About
            </Link>
            <Link href="/projects" className="hover:text-purple-300 transition-colors">
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
            <Link href="https://github.com/Dextron04" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/tushin-kulshreshtha-2522b8231/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
                <Linkedin className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="text-center px-4 space-y-6">
          <div className="relative w-full h-64 md:h-96 flex items-center justify-center">
            <ASCIIText text="Tushin" asciiFontSize={8} textFontSize={200} textColor="#fdf9f3" planeBaseHeight={5} enableWaves={false} />
          </div>
          <h2 className="text-xl md:text-2xl text-gray-300">Software Developer & Space Enthusiast</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/projects">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
                View My Work
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600/20 w-full sm:w-auto">
                About Me
              </Button>
            </Link>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="h-8 w-8 text-purple-300" />
        </motion.div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
        {/* About Section */}
        <section id="about" className="relative z-10 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
            <Star className="mr-2 text-purple-400" /> About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-gray-300">
                Hey there! I&apos;m Tushin Kulshreshtha — a passionate Computer Science undergraduate based in San Francisco with a knack for building elegant, scalable, and secure web applications. My curiosity fuels my constant pursuit of innovative tech, whether that means designing RESTful APIs, engineering a custom file system, or crafting a remote monitoring iOS app for a Raspberry Pi cluster.
              </p>
              <p className="text-gray-300">
                From full-stack engineering internships to AI-driven projects, I&apos;ve thrived in agile environments, delivering performance-optimised, user-friendly solutions. My journey spans Django, React, Spring Boot, AWS, Caddy, Docker, and more. Outside the code, I enjoy stargazing and solving tough problems—be it in tech or a good board game!
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Quick Facts</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span> Based in San Francisco, California
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> B.S. in Computer Science, GPA 3.95 (SFSU, 2021–2025)
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Proficient in Python, JavaScript, C++, Java, Spring Boot
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Web stack: React, Next.js, Node.js, Django, REST APIs
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Cloud-native: AWS (EC2, Lambda, S3), Docker, Caddy
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Built real-time server dashboards and serverless pipelines
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Current AI Intern @ MeetX; enhancing hybrid recommender systems
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Loves automation, system optimization, and efficient design
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <SkillsSection />

        {/* Contact Section */}
        <section id="contact" className="relative z-10 py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center">
            <Star className="mr-2 text-purple-400" /> Get In Touch
          </h2>
          <Card className="bg-slate-900/60 border-purple-900/50 backdrop-blur-sm p-6 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
                Let&apos;s Connect!
              </h3>
              <p className="text-gray-300 mb-8">
                Whether you want to discuss a project, ask a question, or just say hi,
                feel free to reach out to me through any of these platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="https://github.com/Dextron04" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                    <Github className="h-5 w-5 mr-2" /> GitHub
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/tushin-kulshreshtha-2522b8231/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600/20 w-full sm:w-auto">
                    <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
                  </Button>
                </Link>
              </div>
              <ContactForm />
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Tushin Kulshreshtha. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400">
            <Link href="/about" className="hover:text-purple-300 transition-colors">About</Link>
            <Link href="/projects" className="hover:text-purple-300 transition-colors">Projects</Link>
            <Link href="#skills" className="hover:text-purple-300 transition-colors">Skills</Link>
            <Link href="#contact" className="hover:text-purple-300 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

