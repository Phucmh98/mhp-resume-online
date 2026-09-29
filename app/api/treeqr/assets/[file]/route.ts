import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    const res = await fetch(`https://tree.icqr.com/assets/${file}`);

    if (!res.ok) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (file.endsWith(".js")) {
      const code = await res.text();
      return new NextResponse(code, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Asset proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
