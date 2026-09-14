"use client";
import { GitHubUser } from "@/app/types/github.type";
import { useEffect, useState } from "react";
import { BlurImage } from "./ui/blur-image";
import HorizontalLine from "./horizontal-line";
import FlipCoverButton from "./flip-cover-button/flip-cover-button";
import SoftPillButton from "./flip-cover-button/soft-pill-button";
import Link from "next/link";
import SocialContact from "./social-contact";
import { ArrowDownToLine, LoaderPinwheel, Sparkles } from "lucide-react";
import OppsDialog from "./dialog/opps-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfileSection() {
  const [githubUser, setGitHubUser] = useState<GitHubUser>();
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  const handleOpenResume = () => {
    if (loadingResume) return;
    setLoadingResume(true);
    setTimeout(() => {
      setLoadingResume(false);
      setOpenDialog(true);
    }, 500);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.github.com/users/Phucmh98");
        const data = await res.json();
        setGitHubUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="flex w-full p-4 justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="p-0.75 rounded-[6px] sm:rounded-[8px] border-[1.5px] border-black/30 dark:border-white/15 shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[3px] sm:rounded-[5px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              {githubUser?.avatar_url ? (
                <BlurImage
                  src={githubUser.avatar_url}
                  alt={githubUser.name || "Profile"}
                  width={240}
                  height={240}
                  quality={90}
                  className="h-full w-full origin-center object-cover"
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center pt-8">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
              Phuc
            </h1>
            <p className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">
              {new Date().getFullYear() - 1998}
            </p>
          </div>
        </div>
        <TooltipProvider delay={100} >
          <div className="flex items-start gap-2">
            <Tooltip >
              <TooltipTrigger
                render={
                  <SoftPillButton
                    variant="primary"
                    className="px-3 py-1.5 text-[12px]! cursor-pointer md:max-lg:p-0! md:max-lg:size-7.5 md:max-lg:flex md:max-lg:items-center md:max-lg:justify-center"
                    onClick={handleOpenResume}
                    disabled={loadingResume}
                  >
                    <div className="flex items-center gap-1.5 md:max-lg:gap-0 md:max-lg:justify-center whitespace-nowrap">
                      {loadingResume ? (
                        <LoaderPinwheel className="w-3.5 h-3.5 shrink-0 animate-spin" />
                      ) : (
                        <ArrowDownToLine className="w-3.5 h-3.5 shrink-0 text-neutral-200 dark:text-neutral-800" />
                      )}
                      <span className="text-neutral-200 dark:text-neutral-800 md:max-lg:hidden">
                        Resume
                      </span>
                    </div>
                  </SoftPillButton>
                }
              />
              <TooltipContent side="top" className="hidden md:max-lg:inline-flex">
                Resume
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <SoftPillButton
                    variant="secondary"
                    className="px-3 py-1.5 text-[12px]! cursor-pointer md:max-lg:p-0! md:max-lg:size-7.5 md:max-lg:flex md:max-lg:items-center md:max-lg:justify-center"
                    onClick={() => setOpenDialog(true)}
                  >
                    <div className="flex items-center gap-1.5 md:max-lg:gap-0 md:max-lg:justify-center whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="md:max-lg:hidden">Know me more</span>
                    </div>
                  </SoftPillButton>
                }
              />
              <TooltipContent side="top" className="hidden md:max-lg:inline-flex">
                Know me more
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <HorizontalLine bleed />
      <div className="px-4 flex flex-col">
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4">
          Civil Engineer / Developer. I love exploring, building, and learning.
        </p>
        <ul className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4 pl-4">
          <li className="flex gap-1.5">
            <span>•</span>
            <span>Just exploring code turned me into a developer.</span>
          </li>
          <li className="flex gap-1.5">
            <span>•</span>
            <span>
              Building software to solve real problems with clear purpose, open
              to the world.
            </span>
          </li>
          <li className="flex gap-1.5">
            <span>•</span>
            <span>
              Currently building{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                Digital transformation
              </span>{" "}
              in construction and building a
              <span className="font-semibold text-zinc-900 dark:text-white">
                {" "}
                3D View Engine
              </span>
            </span>
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <FlipCoverButton href="https://cal.com/phuc-mai-hoai-kpervx/30min" label="Book an intro call" />
          <Link href="/contact">
            <SoftPillButton
              as="span"
              variant="secondary"
              className="px-3 py-1.5 text-[12px]!"
            >
              <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send an email
              </div>
            </SoftPillButton>
          </Link>
        </div>
        <SocialContact />
      </div>
      {openDialog && <OppsDialog open={openDialog} onClose={() => setOpenDialog(false)} />}
    </>
  );
}
