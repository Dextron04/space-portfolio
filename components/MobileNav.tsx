"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, FolderGit2 } from "lucide-react"

export function MobileNav() {
    const pathname = usePathname()

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/about", label: "About", icon: User },
        { href: "/projects", label: "Projects", icon: FolderGit2 },
        // { href: "/contact", label: "Contact", icon: Mail },
    ]

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
            <div className="flex justify-around items-center h-16 px-6 bg-slate-900/80 backdrop-blur-sm border border-purple-900/30 rounded-full shadow-lg shadow-purple-900/20">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full ${isActive ? "text-purple-400" : "text-gray-400 hover:text-purple-300"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
} 