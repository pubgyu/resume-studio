import type { MetadataRoute } from "next";

import { absoluteUrl, getSiteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteUrl().origin,
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/icon.svg", "/opengraph-image", "/twitter-image"],
        disallow: ["/api/", "/auth/", "/resumes/"]
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
