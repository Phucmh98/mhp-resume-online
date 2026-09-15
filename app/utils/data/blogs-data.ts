export interface Blog {
    title: string;
    date: string;
    claps: number;
    tags: string[];
    link: string;
    isExternal: boolean;
    slug?: string;
    description?: string;
    readingTime?: string;
    content?: BlogBlock[];
}

export type BlogBlock =
    | {
        type: "heading";
        text: string;
    }
    | {
        type: "paragraph";
        text: string;
    }
    | {
        type: "quote";
        text: string;
    }
    | {
        type: "image";
        src: string;
        alt: string;
        caption: string;
        width: number;
        height: number;
    }
    | {
        type: "list";
        items: string[];
    }
    | {
        type: "links";
        items: {
            title: string;
            href: string;
            description: string;
        }[];
    };

export const blogsData: Blog[] = [
    {
        title: "Install & Config Cesium in Next.js 15 (2025)",
        date: "Oct 2025",
        claps: 264,
        tags: ["Cesium", "Next.js 15", "WebGIS"],
        link: "",
        isExternal: false,
    },
    {
        title: "Install & Config Cesium in Next.js 16 (2026)",
        date: "Jan 2026",
        claps: 189,
        tags: ["Cesium", "Next.js 16", "Turbopack"],
        link: "",
        isExternal: false,
    }
];

export const blogPosts = blogsData.filter(
    (blog): blog is Blog & { slug: string; content: BlogBlock[] } =>
        typeof blog.slug === "string" && Array.isArray(blog.content),
);

export function getBlogPostBySlug(slug: string) {
    return blogPosts.find((blog) => blog.slug === slug);
}
