import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query || "";
    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;

    // 1. Try official GitHub GraphQL API if token is provided
    if (token) {
      try {
        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "mhp-resume-online",
          },
          body: JSON.stringify({ query }),
          next: { revalidate: 3600 },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.data?.user?.contributionsCollection) {
            return NextResponse.json(data);
          }
        }
      } catch (err) {
        console.error("GitHub GraphQL API error:", err);
      }
    }

    // 2. Fetch directly from GitHub contributions page (real-time & official)
    const match = query.match(/login:\s*"([^"]+)"/);
    const username = match ? match[1] : "Phucmh98";

    try {
      const ghRes = await fetch(
        `https://github.com/users/${username}/contributions`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          next: { revalidate: 3600 },
        },
      );

      if (ghRes.ok) {
        const html = await ghRes.text();

        // Parse total contributions
        const totalMatch = html.match(
          /(\d[\d,]*)\s+contributions\s+in\s+the\s+last\s+year/i,
        );
        const totalContributions = totalMatch
          ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
          : 0;

        // Tooltips map: id -> count
        const tooltips = new Map<string, number>();
        const tipRegex =
          /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
        let tip: RegExpExecArray | null;
        while ((tip = tipRegex.exec(html)) !== null) {
          const id = tip[1];
          const text = tip[2].replace(/\s+/g, " ").trim();
          const countMatch = text.match(/^(\d+)\s+contribution/i);
          const count = countMatch
            ? parseInt(countMatch[1], 10)
            : text.startsWith("No contribution")
              ? 0
              : 1;
          tooltips.set(id, count);
        }

        // Days
        const dayRegex =
          /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>[\s\S]*?<\/td>/g;
        const days: { date: string; contributionCount: number; level: number }[] = [];
        let day: RegExpExecArray | null;
        while ((day = dayRegex.exec(html)) !== null) {
          const date = day[1];
          const id = day[2];
          const level = parseInt(day[3], 10);
          const count = tooltips.get(id) ?? (level > 0 ? 1 : 0);
          days.push({ date, contributionCount: count, level });
        }

        // Sort days ascending by date
        days.sort((a, b) => a.date.localeCompare(b.date));

        if (days.length > 0) {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const months: { name: string }[] = [];
          const seenMonths = new Set<string>();
          for (const d of days) {
            const monthIndex = new Date(`${d.date}T00:00:00`).getMonth();
            const name = monthNames[monthIndex];
            if (!seenMonths.has(name)) {
              seenMonths.add(name);
              months.push({ name });
            }
          }

          // Group into weeks (column-based, Sunday-Saturday)
          const weeks: {
            contributionDays: { contributionCount: number; date: string; level: number }[];
          }[] = [];
          let currentWeek: { contributionCount: number; date: string; level: number }[] = [];
          for (const d of days) {
            currentWeek.push(d);
            const dayOfWeek = new Date(`${d.date}T00:00:00`).getDay();
            if (dayOfWeek === 6) {
              weeks.push({ contributionDays: currentWeek });
              currentWeek = [];
            }
          }
          if (currentWeek.length > 0) {
            weeks.push({ contributionDays: currentWeek });
          }

          return NextResponse.json({
            data: {
              user: {
                contributionsCollection: {
                  contributionCalendar: {
                    totalContributions:
                      totalContributions ||
                      days.reduce((a, b) => a + b.contributionCount, 0),
                    months,
                    weeks,
                  },
                },
              },
            },
          });
        }
      }
    } catch (scrapErr) {
      console.error("Direct GitHub contributions scrape error:", scrapErr);
    }

    // 3. Last fallback: jogruber.de API
    const publicRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } },
    );

    if (publicRes.ok) {
      const publicData = await publicRes.json();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthsMap = new Set<string>();
      const months: { name: string }[] = [];

      for (const day of publicData.contributions || []) {
        const d = new Date(day.date);
        const mName = monthNames[d.getUTCMonth()];
        if (!monthsMap.has(mName)) {
          monthsMap.add(mName);
          months.push({ name: mName });
        }
      }

      const weeks: {
        contributionDays: { contributionCount: number; date: string; level: number }[];
      }[] = [];
      let currentWeek: { contributionCount: number; date: string; level: number }[] = [];

      for (const day of publicData.contributions || []) {
        currentWeek.push({
          contributionCount: day.count,
          date: day.date,
          level: day.level ?? (day.count > 0 ? 1 : 0),
        });
        if (currentWeek.length === 7) {
          weeks.push({ contributionDays: currentWeek });
          currentWeek = [];
        }
      }
      if (currentWeek.length > 0) {
        weeks.push({ contributionDays: currentWeek });
      }

      return NextResponse.json({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions:
                  publicData.total?.lastYear ??
                  publicData.total?.[new Date().getFullYear()] ??
                  0,
                months,
                weeks,
              },
            },
          },
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 502 },
    );
  } catch (error) {
    console.error("API /api/github error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
