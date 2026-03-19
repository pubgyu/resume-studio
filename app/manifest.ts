import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#f3f5f8",
    description: SITE_DESCRIPTION,
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml"
      }
    ],
    lang: "ko",
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/login",
    theme_color: "#4e6685"
  };
}
