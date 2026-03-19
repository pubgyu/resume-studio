import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site-config";

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
          background:
            "radial-gradient(circle at top right, rgba(124, 146, 176, 0.14), transparent 26%), linear-gradient(180deg, #0f1318 0%, #141920 100%)",
          color: "#eef2f6",
          display: "flex",
          flex: 1,
          fontFamily: "sans-serif",
          justifyContent: "center",
          padding: "60px"
        }}
      >
        <div
          style={{
            alignItems: "stretch",
            background: "rgba(18, 22, 28, 0.84)",
            border: "1px solid rgba(144, 160, 178, 0.16)",
            borderRadius: "28px",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "64px"
          }}
        >
          <div
            style={{
              background: "rgba(124, 146, 176, 0.82)",
              borderRadius: "999px",
              display: "flex",
              height: 6,
              width: 88
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              marginTop: 32
            }}
          >
            <div
              style={{
                color: "#9ea9b6",
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase"
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                color: "#f6f8fb",
                display: "flex",
                fontSize: 88,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.98
              }}
            >
              Resume Room
            </div>
            <div
              style={{
                color: "#aab4bf",
                display: "flex",
                fontSize: 31,
                lineHeight: 1.35,
                maxWidth: 760
              }}
            >
              Create, save, and export resumes in one calm workspace.
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 18,
              marginTop: "auto"
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(144, 160, 178, 0.14)",
                borderRadius: "999px",
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                padding: "14px 22px"
              }}
            >
              Save drafts
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(144, 160, 178, 0.14)",
                borderRadius: "999px",
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                padding: "14px 22px"
              }}
            >
              Edit anytime
            </div>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(144, 160, 178, 0.14)",
                borderRadius: "999px",
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                padding: "14px 22px"
              }}
            >
              Export PDF
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
