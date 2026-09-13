"use client";

import React, { useEffect, useMemo, useState } from "react";
import HorizontalLine from "./horizontal-line";
import { Skeleton } from "@/components/ui/skeleton";

interface ContributionDay {
  contributionCount: number;
  date: string;
  level?: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionMonth {
  name: string;
}

interface ContributionLevel {
  cell: string;
}

interface TooltipState {
  count: number;
  date: string;
  x: number;
  y: number;
}

export function GithubGraph() {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [months, setMonths] = useState<ContributionMonth[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const emptyWeeks = useMemo<ContributionWeek[]>(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 370);

    return Array.from({ length: 53 }, (_, weekIndex) => ({
      contributionDays: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(start);
        date.setDate(start.getDate() + weekIndex * 7 + dayIndex);

        return {
          contributionCount: 0,
          date: date.toISOString().slice(0, 10),
          level: 0,
        };
      }),
    }));
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      const cacheKey = "github_contributions_v2";

      // Clear legacy stale cache
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("github_contributions");
        } catch {}
      }

      const cachedData =
        typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;

      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed?.weeks?.length > 0) {
            setWeeks(parsed.weeks);
            setMonths(parsed.months || []);
            setTotalContributions(parsed.totalContributions || 0);
            setLoading(false);
          }
        } catch {
          setLoading(true);
        }
      }

      const query = `
        query {
          user(login: "Phucmh98") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                months {
                  name
                }
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    level
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch("/api/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const calendar =
          data?.data?.user?.contributionsCollection?.contributionCalendar;

        if (calendar) {
          setWeeks(calendar.weeks);
          setMonths(calendar.months);
          setTotalContributions(calendar.totalContributions);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({
                  weeks: calendar.weeks,
                  months: calendar.months,
                  totalContributions: calendar.totalContributions,
                  updatedAt: Date.now(),
                }),
              );
            } catch {}
          }
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const contributionLevels = useMemo<ContributionLevel[]>(
    () => [
      {
        cell: "bg-zinc-100 dark:bg-zinc-800",
      },
      {
        cell: "bg-zinc-300 dark:bg-zinc-600",
      },
      {
        cell: "bg-zinc-500 dark:bg-zinc-500",
      },
      {
        cell: "bg-zinc-700 dark:bg-zinc-300",
      },
      {
        cell: "bg-zinc-950 dark:bg-zinc-100",
      },
    ],
    [],
  );

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const showTooltip = (
    day: ContributionDay,
    event: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      count: day.contributionCount,
      date: formatDate(day.date),
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const defaultMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const displayMonths =
    months.length > 0
      ? months.map((m) => m.name.substring(0, 3))
      : defaultMonths;
  const graphWeeks = weeks.length > 0 ? weeks : emptyWeeks;
  const graphStatus =
    loading && totalContributions === 0
      ? "Loading GitHub contribution activity"
      : `${totalContributions} GitHub activities in the last year`;

  return (
    <section
      className="relative z-10 mt-6 flex flex-col scroll-mt-24"
      aria-labelledby="github-activity-title"
      aria-describedby="github-activity-summary"
    >
      {/* Top full-width dashed line */}
      <HorizontalLine bleed />

      {/* Heading */}
      <div className="relative py-2 px-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="github-activity-title"
            className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            GitHub Activity
          </h2>
          {loading && totalContributions === 0 ? (
            <Skeleton className="h-3.5 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <p
              className="text-right text-[11px] text-zinc-500 dark:text-zinc-400"
              aria-live="polite"
            >
              {totalContributions} GitHub activities in the last year
            </p>
          )}
        </div>

        {/* Bottom full-width dashed line under heading */}
      </div>
      <HorizontalLine bleed />

      <p id="github-activity-summary" className="sr-only">
        Calendar heatmap showing daily GitHub contribution counts for Phucmh98
        over the last year. Scroll horizontally to inspect all weeks.
      </p>

      {/* Graph content — sits directly on the page background */}
      <div className="relative py-4 px-4">
        <div className="w-full">
          <div>
            <div className="mb-2 flex w-full justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              {displayMonths.map((month, index) => (
                <span key={`${month}-${index}`}>{month}</span>
              ))}
            </div>

            <div
              className="grid gap-x-0.5"
              style={{
                gridTemplateColumns: `repeat(${graphWeeks.length || 53}, minmax(0, 1fr))`,
              }}
              role="img"
              aria-label={graphStatus}
            >
              {loading && weeks.length === 0
                ? Array.from({ length: 53 }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-0.5">
                      {Array.from({ length: 7 }).map((__, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="aspect-square w-full animate-pulse rounded-xs bg-zinc-100 dark:bg-zinc-800"
                        />
                      ))}
                    </div>
                  ))
                : graphWeeks.map((week, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-0.5">
                      {colIndex === 0 &&
                        Array.from({
                          length: 7 - week.contributionDays.length,
                        }).map((_, i) => (
                          <div
                            key={`empty-top-${i}`}
                            className="aspect-square w-full rounded-xs bg-transparent"
                          />
                        ))}

                      {week.contributionDays.map((day) => {
                        const level =
                          typeof day.level === "number" && day.level >= 0
                            ? day.level
                            : getLevel(day.contributionCount);
                        const color =
                          contributionLevels[
                            Math.min(
                              Math.max(level, 0),
                              contributionLevels.length - 1,
                            )
                          ];

                        return (
                          <div
                            key={day.date}
                            aria-hidden="true"
                            aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                            className={`aspect-square w-full rounded-xs opacity-80 outline-none transition-[opacity,transform] hover:scale-125 hover:opacity-100 dark:opacity-70 dark:hover:opacity-100 ${color.cell}`}
                            onMouseEnter={(event) => showTooltip(day, event)}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        );
                      })}

                      {colIndex !== 0 &&
                        week.contributionDays.length < 7 &&
                        Array.from({
                          length: 7 - week.contributionDays.length,
                        }).map((_, i) => (
                          <div
                            key={`empty-bottom-${i}`}
                            className="aspect-square w-full rounded-xs bg-transparent"
                          />
                        ))}
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Less active
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {contributionLevels.map((level, index) => (
              <div
                key={index}
                aria-hidden="true"
                className={`size-2 rounded-xs opacity-80 dark:opacity-70 ${level.cell}`}
              />
            ))}
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              More active
            </span>
          </div>
        </div>

        {tooltip && (
          <div
            className="pointer-events-none fixed z-100 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 shadow-lg shadow-zinc-950/10 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:shadow-black/40"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.count} contributions on {tooltip.date}
          </div>
        )}
      </div>
    </section>
  );
}
