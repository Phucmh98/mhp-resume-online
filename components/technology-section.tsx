import Image from "next/image";
import HorizontalLine from "./horizontal-line";
const skills = [
  { name: "React", icon: "react" },
  { name: "Next", icon: "nextdotjs" },
  { name: "Expo", icon: "expo" },
  { name: "Django", icon: "django" },
  { name: "Express", icon: "express" },
  { name: "Node", icon: "nodedotjs" },
  { name: "Bun", icon: "bun" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "Redis", icon: "redis" },
  { name: "Prisma", icon: "prisma" },
  {
    name: "Zustand",
    icon: "https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico",
  },
  { name: "Tanstack Query", icon: "reactquery" },
  { name: "Postman", icon: "postman" },
  { name: "Tailwind", icon: "tailwindcss" },
  { name: "shadcn", icon: "shadcnui" },
  { name: "Motion", icon: "framer" },
  { name: "GSAP", icon: "greensock" },
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Python", icon: "python" },
  { name: "C/C++", icon: "cplusplus" },
  { name: "SQL", icon: "databricks" },
  { name: "Git", icon: "git" },
  { name: "Github", icon: "github" },
  { name: "Figma", icon: "figma" },
  { name: "Docker", icon: "docker" },
  { name: "Linux", icon: "linux" },
];

export default function TechnologySection() {
  return (
    <>
      <h2 className="px-4 py-2 text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Skills & Technologies
      </h2>
      <HorizontalLine bleed />
      <div className="relative py-6 mx-4">
        <div className="flex flex-wrap gap-2 w-full">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="grow flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0a0a0a] dark:hover:bg-[#121214] border border-black/30 dark:border-white/15 rounded-[6px] transition-colors duration-200 cursor-default"
            >
              <Image
                src={
                  skill.icon.startsWith("http")
                    ? skill.icon
                    : `https://cdn.simpleicons.org/${skill.icon}/71717a`
                }
                alt={skill.name}
                width={14}
                height={14}
                unoptimized
                className={`h-3.5 w-3.5 opacity-80 ${skill.icon.startsWith("http") ? "rounded-sm grayscale" : ""}`}
              />
              <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
