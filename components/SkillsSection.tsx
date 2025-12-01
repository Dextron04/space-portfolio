import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import AwsIcon from './icons/AwsIcon';

const SkillsSection = () => {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [visibleSkills, setVisibleSkills] = useState<Set<string>>(new Set());
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const skill = entry.target.getAttribute('data-skill');
                        if (skill) {
                            setTimeout(() => {
                                setVisibleSkills(prev => new Set([...prev, skill]));
                            }, Math.random() * 300);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        const skillElements = document.querySelectorAll('[data-skill]');
        skillElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    const skillCategories = [
        {
            title: "Frontend Development",
            skills: [
                {
                    name: "React",
                    color: "from-blue-400/20 to-cyan-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                },
                {
                    name: "React Native",
                    color: "from-blue-500/20 to-cyan-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                },
                {
                    name: "Next.js",
                    color: "from-gray-400/20 to-white/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                },
                {
                    name: "JavaScript",
                    color: "from-yellow-400/20 to-orange-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                },
                {
                    name: "Vite",
                    color: "from-purple-500/20 to-yellow-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg"
                }
            ]
        },
        {
            title: "Backend Development",
            skills: [
                {
                    name: "Python",
                    color: "from-yellow-400/20 to-blue-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                },
                {
                    name: "Java",
                    color: "from-red-500/20 to-orange-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                },
                {
                    name: "Node.js",
                    color: "from-green-500/20 to-green-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                },
                {
                    name: "Spring Boot",
                    color: "from-green-500/20 to-yellow-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
                },
                {
                    name: "Django",
                    color: "from-green-600/20 to-green-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg"
                },
                {
                    name: "C++",
                    color: "from-blue-600/20 to-blue-800/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
                }
            ]
        },
        {
            title: "Databases",
            skills: [
                {
                    name: "PostgreSQL",
                    color: "from-blue-600/20 to-indigo-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                },
                {
                    name: "MySQL",
                    color: "from-blue-500/20 to-blue-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                },
                {
                    name: "MongoDB",
                    color: "from-green-600/20 to-green-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                },
                {
                    name: "Azure SQL",
                    color: "from-blue-400/20 to-blue-600/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
                }
            ]
        },
        {
            title: "Cloud & DevOps",
            skills: [
                {
                    name: "AWS",
                    color: "from-orange-500/20 to-yellow-400/20",
                    logo: "/aws.svg"
                },
                {
                    name: "Docker",
                    color: "from-blue-500/20 to-blue-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                },
                {
                    name: "Git",
                    color: "from-red-500/20 to-orange-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                },
                {
                    name: "Linux",
                    color: "from-yellow-400/20 to-gray-800/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                }
            ]
        },
        {
            title: "AI/ML & Specialized",
            skills: [
                {
                    name: "TensorFlow",
                    color: "from-orange-500/20 to-orange-400/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
                },
                {
                    name: "PyTorch",
                    color: "from-red-500/20 to-orange-500/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
                },
                {
                    name: "REST APIs",
                    color: "from-purple-500/20 to-pink-500/20",
                    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"
                },
                {
                    name: "Temporal",
                    color: "from-purple-600/20 to-blue-500/20",
                    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E"
                },
                {
                    name: "OAuth 2.0",
                    color: "from-green-500/20 to-blue-500/20",
                    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E"
                },
                {
                    name: "Socket.IO",
                    color: "from-gray-700/20 to-white/20",
                    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg"
                }
            ]
        }
    ];

    return (
        <section id="skills" className="relative z-10 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 flex items-center justify-center text-white">
                    <Star className="mr-3 text-slate-400" size={32} />
                    Skills & Technologies
                </h2>
                <div className="space-y-16">
                    {skillCategories.map((category, categoryIndex) => (
                        <div key={category.title} className="space-y-8">
                            <h3 className="text-xl font-medium text-slate-300 text-center opacity-80">
                                {category.title}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {category.skills.map((skill, skillIndex) => {
                                    const isVisible = visibleSkills.has(skill.name);
                                    const isHovered = hoveredSkill === skill.name;
                                    return (
                                        <div
                                            key={skill.name}
                                            data-skill={skill.name}
                                            className={`
                        group relative overflow-hidden rounded-xl cursor-pointer
                        transition-all duration-500 ease-out
                        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}
                      `}
                                            style={{
                                                transitionDelay: `${categoryIndex * 100 + skillIndex * 80}ms`
                                            }}
                                            onMouseEnter={() => setHoveredSkill(skill.name)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            onMouseMove={(e) => handleMouseMove(e)}
                                        >
                                            {/* Glassmorphism card */}
                                            <div className="relative p-4 h-28 flex flex-col items-center justify-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                                {/* Gradient overlay on hover */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
                                                {/* Subtle glow effect */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                {/* Mouse follow light effect */}
                                                {isHovered && (
                                                    <div
                                                        className="absolute w-32 h-32 bg-white/10 rounded-full blur-xl transition-all duration-200 pointer-events-none"
                                                        style={{
                                                            left: mousePosition.x - 64,
                                                            top: mousePosition.y - 64,
                                                            opacity: 0.6
                                                        }}
                                                    ></div>
                                                )}
                                                {/* Logo */}
                                                <div className="relative z-10 mb-2 w-8 h-8 flex items-center justify-center">
                                                    {skill.name === "AWS" ? (
                                                        <AwsIcon className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 group-hover:scale-110" />
                                                    ) : (
                                                        <img
                                                            src={skill.logo}
                                                            alt={`${skill.name} logo`}
                                                            className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 group-hover:scale-110"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                {/* Skill name */}
                                                <span className="relative z-10 text-slate-200 font-medium text-xs text-center group-hover:text-white transition-colors duration-300">
                                                    {skill.name}
                                                </span>
                                                {/* Subtle corner accent */}
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-xl rounded-tl-xl"></div>
                                            </div>
                                            {/* Floating dots animation */}
                                            {isHovered && (
                                                <>
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                                                    <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                                    <div className="absolute top-1/2 -left-1 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .gentle-float {
          animation: gentle-float 6s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
};

export default SkillsSection; 