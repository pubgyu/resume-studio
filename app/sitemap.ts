import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      changeFrequency: "monthly",
      lastModified,
      priority: 0.9,
      url: absoluteUrl("/login")
    }
  ];
}
