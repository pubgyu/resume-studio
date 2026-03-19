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
            "radial-gradient(circle at top left, rgba(122, 139, 160, 0.12), transparent 24%), linear-gradient(180deg, #11161b 0%, #181d24 100%)",
          display: "flex",
          flex: 1,
          fontFamily: "sans-serif",
          justifyContent: "center",
          padding: "56px"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            gap: "44px",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: "rgba(20, 24, 30, 0.86)",
              border: "1px solid rgba(143, 155, 170, 0.14)",
              borderRadius: "28px",
              display: "flex",
              height: "518px",
              padding: "28px",
              width: "394px"
            }}
          >
            <div
              style={{
                background: "#fbfbfa",
                border: "1px solid rgba(18, 22, 28, 0.08)",
                borderRadius: "18px",
                display: "flex",
                flex: 1,
                flexDirection: "column",
                padding: "28px"
              }}
            >
              <div
                style={{
                  alignItems: "flex-start",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "28px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div
                    style={{
                      background: "#253242",
                      borderRadius: "999px",
                      display: "flex",
                      height: "16px",
                      width: "124px"
                    }}
                  />
                  <div
                    style={{
                      background: "#64748b",
                      borderRadius: "999px",
                      display: "flex",
                      height: "10px",
                      width: "92px"
                    }}
                  />
                </div>
                <div
                  style={{
                    background: "linear-gradient(180deg, #dbe4ef 0%, #f2f5f8 100%)",
                    border: "1px solid rgba(37, 50, 66, 0.08)",
                    borderRadius: "999px",
                    display: "flex",
                    height: "58px",
                    width: "58px"
                  }}
                />
              </div>
              <div
                style={{
                  alignItems: "stretch",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div
                    style={{
                      background: "#d4dde6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "100%"
                    }}
                  />
                  <div
                    style={{
                      background: "#d4dde6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "84%"
                    }}
                  />
                </div>
                <div
                  style={{
                    background: "#f4f6f8",
                    border: "1px solid #e3e9ef",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      background: "#253242",
                      borderRadius: "999px",
                      display: "flex",
                      height: "10px",
                      width: "86px"
                    }}
                  />
                  <div
                    style={{
                      background: "#d6dee6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "100%"
                    }}
                  />
                  <div
                    style={{
                      background: "#d6dee6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "90%"
                    }}
                  />
                  <div
                    style={{
                      background: "#d6dee6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "94%"
                    }}
                  />
                </div>
                <div
                  style={{
                    background: "#f4f6f8",
                    border: "1px solid #e3e9ef",
                    borderRadius: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "18px"
                  }}
                >
                  <div
                    style={{
                      background: "#253242",
                      borderRadius: "999px",
                      display: "flex",
                      height: "10px",
                      width: "112px"
                    }}
                  />
                  <div
                    style={{
                      background: "#d6dee6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "92%"
                    }}
                  />
                  <div
                    style={{
                      background: "#d6dee6",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "82%"
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px"
                  }}
                >
                  <div
                    style={{
                      background: "#eef3f8",
                      border: "1px solid #e1e8ef",
                      borderRadius: "14px",
                      display: "flex",
                      flex: 1,
                      height: "88px"
                    }}
                  />
                  <div
                    style={{
                      background: "#eef3f8",
                      border: "1px solid #e1e8ef",
                      borderRadius: "14px",
                      display: "flex",
                      flex: 1,
                      height: "88px"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#eef2f6",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "470px"
            }}
          >
            <div
              style={{
                color: "#9ca8b6",
                display: "flex",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase"
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                color: "#f7f8fa",
                display: "flex",
                fontSize: "72px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.02
              }}
            >
              Resume that looks ready.
            </div>
            <div
              style={{
                color: "#adb7c2",
                display: "flex",
                fontSize: "30px",
                lineHeight: 1.36
              }}
            >
              Build, save, and export polished resumes in one workspace.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
