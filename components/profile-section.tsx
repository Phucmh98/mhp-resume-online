"use client";
import { GitHubUser } from "@/app/types/github.type";
import { useEffect, useState } from "react";
import { BlurImage } from "./ui/blur-image";
import HorizontalLine from "./horizontal-line";
import LiveAge from "./live-age";
import FlipCoverButton from "./flip-cover-button/flip-cover-button";
import SoftPillButton from "./flip-cover-button/soft-pill-button";
import Link from "next/link";
import SocialContact from "./social-contact";
import { ArrowDownToLine, LoaderPinwheel, Sparkles } from "lucide-react";
import OppsDialog from "./dialog/opps-dialog";
import { Badge } from "@/components/ui/badge";
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
  const newLocal = (
    <div className="flex self-stretch flex-col items-end justify-between gap-2 py-1">
      <div className="flex items-start gap-2">
        <Tooltip>
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
      <Badge
        variant="outline"
        className="h-6 gap-1.5 border-emerald-600/20 bg-emerald-50 px-2.5 text-[11px] font-semibold text-green-600 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-green-400"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-green-600 shadow-[0_0_0_3px_rgba(16,185,129,0.16),0_0_8px_rgba(16,185,129,0.35)] dark:bg-green-400 dark:shadow-[0_0_0_3px_rgba(134,239,172,0.22),0_0_12px_rgba(134,239,172,0.55)]" />
        Open to work
      </Badge>
    </div>
  );
  return (
    <TooltipProvider delay={100}>
      <div className="flex w-full p-4 justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
          <div className="flex flex-col justify-center pt-8 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                Phuc
              </h1>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="inline-flex cursor-default items-center shrink-0" title="Verified Profile">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4.5 sm:size-5 shrink-0 select-none"
                        fill="none"
                        aria-label="Verified Profile"
                      >
                        <path
                          d="M 9.72 3.5 Q 12 1, 14.28 3.5 Q 17.5 2.47, 18.22 5.78 Q 21.53 6.5, 20.5 9.72 Q 23 12, 20.5 14.28 Q 21.53 17.5, 18.22 18.22 Q 17.5 21.53, 14.28 20.5 Q 12 23, 9.72 20.5 Q 6.5 21.53, 5.78 18.22 Q 2.47 17.5, 3.5 14.28 Q 1 12, 3.5 9.72 Q 2.47 6.5, 5.78 5.78 Q 6.5 2.47, 9.72 3.5 Z"
                          fill="#1d9bf0"
                        />
                        <polyline
                          points="8 12 10.8 14.8 16 9.5"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  }
                />
                <TooltipContent side="top" className="text-[11px] font-medium">
                  Verified Profile
                </TooltipContent>
              </Tooltip>
            </div>
            <LiveAge />
          </div>
        </div>
        {newLocal}
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
          <FlipCoverButton
            href="https://cal.com/phuc-mai-hoai-kpervx/30min"
            label="Book an intro call"
          />
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
      {openDialog && (
        <OppsDialog open={openDialog} onClose={() => setOpenDialog(false)} />
      )}
    </TooltipProvider>
  );
}
