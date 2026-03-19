import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

export const alt = SITE_NAME;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "radial-gradient(circle at top left, rgba(104, 130, 162, 0.24), transparent 28%), linear-gradient(180deg, #11161d 0%, #161b22 100%)",
          color: "#eef2f6",
          display: "flex",
          flex: 1,
          fontFamily: "sans-serif",
          justifyContent: "center",
          padding: "56px"
        }}
      >
        <div
          style={{
            background: "rgba(18, 23, 30, 0.86)",
            border: "1px solid rgba(125, 150, 179, 0.18)",
            borderRadius: "32px",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px"
          }}
        >
          <div
            style={{
              color: "#9aa6b4",
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase"
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            <div
              style={{
                color: "#f4f7fb",
                display: "flex",
                fontSize: 74,
                fontWeight: 800,
                lineHeight: 1.04
              }}
            >
              Resume builder for saving, editing, and exporting PDF.
            </div>
            <div
              style={{
                color: "#aeb8c3",
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35
              }}
            >
              {SITE_TAGLINE}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
