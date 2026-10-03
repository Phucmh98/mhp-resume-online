import { BLOGS_DATA } from "@/app/utils/data/blogs-data";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const qParam = url.searchParams.get("q") || BLOGS_DATA.treeqr.param;

    const res = await fetch(BLOGS_DATA.treeqr.url + qParam, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    let html = await res.text();

    // Point assets to our proxy or absolute remote URLs
    html = html.replace(/src="\/assets\//g, 'src="/api/treeqr/assets/');
    html = html.replace(/href="\/assets\//g, 'href="/api/treeqr/assets/');
    html = html.replace(
      /href="\/favicon\//g,
      'href="https://tree.icqr.com/favicon/',
    );

    // Injected CSS and clean-up script
    const injectContent = `
    <script>
      // Polyfill/safe-guard history & location so tree slug is immediately loaded
      (function() {
        const targetQ = ${JSON.stringify(qParam)};
        if (!window.location.search || !window.location.search.includes('q=')) {
          try {
            const newUrl = window.location.pathname + '?q=' + targetQ;
            window.history.replaceState(null, '', newUrl);
          } catch(e) {}
        }

        const origReplace = window.history.replaceState;
        window.history.replaceState = function() {
          try {
            return origReplace.apply(this, arguments);
          } catch(e) {}
        };
        const origPush = window.history.pushState;
        window.history.pushState = function() {
          try {
            return origPush.apply(this, arguments);
          } catch(e) {}
        };
      })();
    </script>
    <style>
      /* Ensure full container size and seamless background */
      html, body, #root, #root > div {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: transparent !important;
      }

      /* 1. Ẩn Logo ICQR */
      a, a[href*="icqr.com"], img[alt*="QR"], img[alt*="ICQR"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* 2. Ẩn toàn bộ nút bấm (Visit link, Make another QR, Sound, Share, Info, credits) */
      button, [role="button"], [role="tooltip"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* 3. Ẩn thanh bottom control và top-right credit */
      div[style*="bottom:"], div[style*="right:"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* 4. Ẩn overlay "Unsupported screen size" */
      div:has(> div > h2), div:has(> h2), h2, h2 + p {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* 5. Đảm bảo duy nhất Canvas WebGL 3D hiển thị trọn vẹn và tương tác chuột xoay mượt mà */
      canvas {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        background: transparent !important;
        visibility: visible !important;
        opacity: 1 !important;
        cursor: grab !important;
        pointer-events: auto !important;
        position: relative !important;
        z-index: 10 !important;
      }
    </style>
    `;

    html = html.replace("<head>", `<head>${injectContent}`);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to proxy treeqr:", error);
    return new NextResponse("Failed to load treeqr", { status: 500 });
  }
}
