"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import ReCAPTCHA from "react-google-recaptcha"
import {
    ArrowLeft,
    BookOpen,
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    Download,
    GraduationCap,
    Heart,
    Moon,
    Star,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add reCAPTCHA script
declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            render: (element: string | HTMLElement, options: RecaptchaOptions) => number;
            reset: (id: number) => void;
        };
    }
}

interface RecaptchaOptions {
    sitekey: string;
    callback: (token: string) => void;
    theme?: 'light' | 'dark';
    size?: 'normal' | 'compact';
}

// Sample personal data - replace with your actual information
const personalData = {
    name: "Tushin Kulshreshtha",
    title: "Software Developer & Space Enthusiast",
    bio: "I'm a passionate software developer with over 5 years of experience creating innovative digital solutions. My journey in technology began with a fascination for how software can transform ideas into reality, and that excitement continues to drive me today.",
    longBio:
        "As a Computer Science undergraduate with hands-on experience across full-stack development, cloud infrastructure, and AI-driven systems, I thrive at the intersection of creativity and engineering. My passion lies in building secure, scalable applications—whether it's designing REST APIs, deploying serverless pipelines on AWS, or creating tools to manage a Raspberry Pi cluster.\n\nBeyond code, I find inspiration in the structure and mystery of the cosmos. Just as space offers infinite frontiers, software development fuels my curiosity with its endless room to build, optimise, and explore. I'm driven by clean architecture, practical innovation, and user-first design—bringing both precision and imagination into everything I create.",
    location: "New York, USA",
    email: "tushin@example.com",
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "San Francisco State University",
            location: "San Francisco, California",
            period: "Aug 2021 – Dec 2025",
            description:
                "GPA: 3.95. Focused on full-stack development, cloud computing, and systems programming through hands-on projects and advanced coursework.",
        },
    ],
    experience: [
        {
            position: "AI Intern",
            company: "MeetX",
            location: "Remote",
            period: "Feb 2025 – Present",
            description:
                "Built a hybrid recommendation system using collaborative filtering and content-based models. Improved cold-start handling and prediction accuracy using XGBoost and TensorFlow.",
        },
        {
            position: "Software Engineer Intern (Full Stack)",
            company: "Site Service Software Inc.",
            location: "Remote",
            period: "Aug 2024 – Present",
            description:
                "Migrated legacy systems to React and Spring Boot. Designed 20+ REST APIs and enhanced security with improved authentication and data encryption.",
        },
        {
            position: "Lead Software Developer Intern",
            company: "Glitter Fund",
            location: "Remote",
            period: "Jan 2023 – Dec 2023",
            description:
                "Led a team to build a Django-based stock filtering platform. Integrated Tradier API, reduced latency by 30%, and deployed infrastructure on AWS EC2.",
        },
    ],

    interests: [
        "Astronomy & Space Exploration",
        "Hiking & Nature Photography",
        "Science Fiction Literature",
        "Gaming",
        "Socializing",
        "Traveling",
    ],
    photos: [
        {
            id: 1,
            title: "Time in Lake Tahoe",
            description: "Fall break in Lake Tahoe with friends.",
            image: "/photos/IMG_6479.jpeg",
            date: "August 2022",
        },
        {
            id: 2,
            title: "Weekend in the Mountains",
            description: "A weekend getaway to the mountains with friends.",
            image: "/photos/IMG_5384.jpeg",
            date: "March 2023",
        },
        {
            id: 3,
            title: "Museum of Fine Arts",
            description: "Visiting the Museum of Fine Arts in San Francisco.",
            image: "/photos/IMG_6842.jpeg",
            date: "June 2023",
        },
        {
            id: 4,
            title: "Wandering around the university",
            description: "Wandering around the university",
            image: "/photos/IMG_7111.jpeg",
            date: "January 2023",
        },
        {
            id: 5,
            title: "Half Moon Bay",
            description: "Half Moon Bay during the night.",
            image: "/photos/IMG_7241.jpeg",
            date: "July 2022",
        },
        {
            id: 6,
            title: "Just a good day",
            description: "Just a good day",
            image: "/photos/hike.jpeg",
            date: "July 2022",
        },
    ],
}

export default function AboutPage() {
    const [selectedPhoto, setSelectedPhoto] = useState<(typeof personalData.photos)[0] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [showCaptcha, setShowCaptcha] = useState(false)
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    // Handle resume download
    const handleResumeDownload = () => {
        setShowCaptcha(true)
    }

    // Handle CAPTCHA verification
    const handleCaptchaVerify = (token: string | null) => {
        if (token) {
            // Start download after successful verification
            const link = document.createElement('a')
            link.href = '/Tushin_Resume.pdf'
            link.download = 'Tushin_Kulshreshtha_Resume.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setShowCaptcha(false)
            // Reset the CAPTCHA
            recaptchaRef.current?.reset()
        }
    }

    // Handle photo selection and modal
    const openPhotoModal = (photo: (typeof personalData.photos)[0], index: number) => {
        setSelectedPhoto(photo)
        setCurrentPhotoIndex(index)
        setIsModalOpen(true)
    }

    // Navigate to next photo in modal
    const nextPhoto = () => {
        const newIndex = (currentPhotoIndex + 1) % personalData.photos.length
        setSelectedPhoto(personalData.photos[newIndex])
        setCurrentPhotoIndex(newIndex)
    }

    // Navigate to previous photo in modal
    const prevPhoto = () => {
        const newIndex = (currentPhotoIndex - 1 + personalData.photos.length) % personalData.photos.length
        setSelectedPhoto(personalData.photos[newIndex])
        setCurrentPhotoIndex(newIndex)
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

            {/* Floating planets */}
            <motion.div
                className="absolute top-1/3 right-1/5 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-900 opacity-20"
                animate={{
                    y: [0, 15, 0],
                    rotate: 360,
                }}
                transition={{
                    y: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    rotate: { duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
            />

            <motion.div
                className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 opacity-10"
                animate={{
                    y: [0, -20, 0],
                    rotate: 360,
                }}
                transition={{
                    y: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
            />

            {/* Header with navigation */}
            <header className="relative z-10 p-6 flex justify-between items-center border-b border-purple-900/30">
                <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Moon className="text-purple-300" />
                    <h1 className="text-2xl font-bold">About Me</h1>
                </div>
                <div className="w-[100px]"></div> {/* Spacer for centering */}
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
                {/* Hero section */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/3">
                            <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-full border-4 border-purple-600/50">
                                <Image
                                    src="/photos/tk.jpeg"
                                    alt={personalData.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                            </div>
                        </div>
                        <div className="md:w-2/3 text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
                                {personalData.name}
                            </h2>
                            <p className="text-xl text-gray-300 mb-6">{personalData.title}</p>
                            <p className="text-gray-300 mb-8 max-w-2xl">{personalData.bio}</p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={handleResumeDownload}
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download Resume
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About me tabs */}
                <section className="mb-16">
                    <Tabs defaultValue="biography" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30">
                            <TabsTrigger value="biography" className="data-[state=active]:bg-purple-900/50">
                                Biography
                            </TabsTrigger>
                            <TabsTrigger value="education" className="data-[state=active]:bg-purple-900/50">
                                Education
                            </TabsTrigger>
                            <TabsTrigger value="experience" className="data-[state=active]:bg-purple-900/50">
                                Experience
                            </TabsTrigger>
                            <TabsTrigger value="interests" className="data-[state=active]:bg-purple-900/50">
                                Interests
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="biography"
                            className="mt-6 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6"
                        >
                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                <BookOpen className="mr-2 text-purple-400" /> My Story
                            </h3>
                            <div className="space-y-4 text-gray-300">
                                {personalData.longBio.split("\n\n").map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="education"
                            className="mt-6 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6"
                        >
                            <h3 className="text-2xl font-bold mb-8 flex items-center">
                                <GraduationCap className="mr-2 text-purple-400" /> Education
                            </h3>
                            <div className="space-y-8">
                                {personalData.education.map((edu, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-8 pb-8 border-l-2 border-purple-600/50 last:border-0 last:pb-0"
                                    >
                                        <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-purple-600 ring-4 ring-purple-900/50"></div>
                                        <div className="mb-2 text-sm text-purple-300 font-medium">{edu.period}</div>
                                        <h4 className="text-xl font-bold mb-2 text-white">{edu.degree}</h4>
                                        <div className="text-gray-300 mb-3 flex items-center gap-2">
                                            <span className="font-medium">{edu.institution}</span>
                                            <span className="text-purple-400">•</span>
                                            <span>{edu.location}</span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">{edu.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="experience"
                            className="mt-6 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6"
                        >
                            <h3 className="text-2xl font-bold mb-8 flex items-center">
                                <BriefcaseBusiness className="mr-2 text-purple-400" /> Work Experience
                            </h3>
                            <div className="space-y-8">
                                {personalData.experience.map((exp, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-8 pb-8 border-l-2 border-purple-600/50 last:border-0 last:pb-0"
                                    >
                                        <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-purple-600 ring-4 ring-purple-900/50"></div>
                                        <div className="mb-2 text-sm text-purple-300 font-medium">{exp.period}</div>
                                        <h4 className="text-xl font-bold mb-2 text-white">{exp.position}</h4>
                                        <div className="text-gray-300 mb-3 flex items-center gap-2">
                                            <span className="font-medium">{exp.company}</span>
                                            <span className="text-purple-400">•</span>
                                            <span>{exp.location}</span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="interests"
                            className="mt-6 bg-slate-900/60 backdrop-blur-sm rounded-lg border border-purple-900/30 p-6"
                        >
                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                <Heart className="mr-2 text-purple-400" /> Interests & Hobbies
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {personalData.interests.map((interest, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-br from-slate-900/80 to-indigo-900/50 p-4 rounded-lg border border-purple-800/30 text-center"
                                    >
                                        <div className="text-lg font-medium text-gray-200">{interest}</div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Photo gallery */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center">
                        <Star className="mr-2 text-purple-400" /> Photo Gallery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personalData.photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900/80 to-indigo-900/50 border border-purple-800/30 cursor-pointer"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => openPhotoModal(photo, index)}
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={photo.image}
                                        alt={photo.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-lg font-bold text-white">{photo.title}</h3>
                                    <p className="text-sm text-gray-300">{photo.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Photo modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900/95 border-purple-900/50 text-white max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    {selectedPhoto && (
                        <div className="relative">
                            <div className="absolute top-4 right-4 z-20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-black/50 text-white hover:bg-black/70"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="relative h-[70vh]">
                                <Image
                                    src={selectedPhoto.image}
                                    alt={selectedPhoto.title}
                                    fill
                                    className="object-contain"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        prevPhoto()
                                    }}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        nextPhoto()
                                    }}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </div>
                            <div className="p-6 bg-slate-900">
                                <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
                                <p className="text-gray-300 mb-2">{selectedPhoto.description}</p>
                                <p className="text-sm text-gray-400">{selectedPhoto.date}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* CAPTCHA Modal */}
            <Dialog open={showCaptcha} onOpenChange={setShowCaptcha}>
                <DialogContent className="bg-slate-900/95 border-purple-900/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Verify Human</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            onChange={handleCaptchaVerify}
                            theme="dark"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <footer className="relative z-10 py-6 border-t border-purple-900/30 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex justify-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} {personalData.name}. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

