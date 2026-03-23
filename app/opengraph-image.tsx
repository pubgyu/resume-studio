import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site-config";

export const alt = SITE_NAME;
export const contentType = "image/png";
export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630
};

const regularFont = readFile(join(process.cwd(), "public/fonts/NotoSansKR-Regular.otf"));
const boldFont = readFile(join(process.cwd(), "public/fonts/NotoSansKR-Bold.otf"));

const lineWidths = ["100%", "82%", "88%", "76%"];

export default async function OpenGraphImage() {
  const [regular, bold] = await Promise.all([regularFont, boldFont]);

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at top left, rgba(168, 101, 67, 0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(116, 67, 43, 0.12), transparent 24%), linear-gradient(180deg, #f6efe6 0%, #efe4d8 100%)",
          color: "#201915",
          display: "flex",
          flex: 1,
          fontFamily: '"Noto Sans KR"',
          padding: "44px",
          position: "relative"
        }}
      >
        <div
          style={{
            border: "1px solid rgba(84, 61, 46, 0.1)",
            borderRadius: "34px",
            display: "flex",
            flex: 1,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 251, 245, 0.78), rgba(255, 247, 239, 0.52))",
              display: "flex",
              inset: 0,
              position: "absolute"
            }}
          />
          <div
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(119, 92, 74, 0.035) 0 1px, transparent 1px 34px)",
              display: "flex",
              inset: 0,
              opacity: 0.45,
              position: "absolute"
            }}
          />

          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              padding: "52px 58px",
              position: "relative"
            }}
          >
            <div
              style={{
                display: "flex",
                flex: "0 0 500px",
                position: "relative"
              }}
            >
              <div
                style={{
                  background: "rgba(255, 253, 249, 0.78)",
                  border: "1px solid rgba(101, 77, 61, 0.14)",
                  borderRadius: "32px",
                  boxShadow: "0 26px 60px rgba(69, 47, 33, 0.14)",
                  display: "flex",
                  height: "470px",
                  left: "18px",
                  padding: "24px",
                  position: "absolute",
                  top: "22px",
                  width: "338px"
                }}
              >
                <div
                  style={{
                    background: "#fffaf3",
                    border: "1px solid rgba(96, 73, 58, 0.09)",
                    borderRadius: "22px",
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    gap: "16px",
                    padding: "26px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
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
                          background: "#2f241d",
                          borderRadius: "999px",
                          display: "flex",
                          height: "18px",
                          width: "138px"
                        }}
                      />
                      <div
                        style={{
                          background: "#a86543",
                          borderRadius: "999px",
                          display: "flex",
                          height: "10px",
                          width: "90px"
                        }}
                      />
                    </div>
                    <div
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(219, 205, 193, 0.9), rgba(244, 238, 231, 1))",
                        border: "1px solid rgba(96, 73, 58, 0.09)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "56px",
                        width: "56px"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      background: "rgba(168, 101, 67, 0.08)",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "100%"
                    }}
                  />

                  <div
                    style={{
                      background: "#f7efe6",
                      border: "1px solid rgba(96, 73, 58, 0.08)",
                      borderRadius: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      padding: "18px"
                    }}
                  >
                    <div
                      style={{
                        background: "#3b2d24",
                        borderRadius: "999px",
                        display: "flex",
                        height: "10px",
                        width: "82px"
                      }}
                    />
                    {lineWidths.map((width) => (
                      <div
                        key={width}
                        style={{
                          background: "rgba(108, 98, 88, 0.18)",
                          borderRadius: "999px",
                          display: "flex",
                          height: "8px",
                          width
                        }}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px"
                    }}
                  >
                    <div
                      style={{
                        background: "#f2e8dc",
                        border: "1px solid rgba(96, 73, 58, 0.08)",
                        borderRadius: "18px",
                        display: "flex",
                        flex: 1,
                        height: "108px"
                      }}
                    />
                    <div
                      style={{
                        background: "#f8f1e8",
                        border: "1px solid rgba(96, 73, 58, 0.08)",
                        borderRadius: "18px",
                        display: "flex",
                        flex: 1,
                        height: "108px"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      background: "rgba(108, 98, 88, 0.18)",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "72%"
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 249, 242, 0.9)",
                  border: "1px solid rgba(101, 77, 61, 0.12)",
                  borderRadius: "28px",
                  boxShadow: "0 18px 42px rgba(69, 47, 33, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  padding: "18px",
                  position: "absolute",
                  right: "26px",
                  top: "276px",
                  width: "190px"
                }}
              >
                <div
                  style={{
                    color: "#74432b",
                    display: "flex",
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}
                >
                  Editor
                </div>
                <div
                  style={{
                    background: "#f5ebe0",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    padding: "14px"
                  }}
                >
                  <div
                    style={{
                      background: "#3b2d24",
                      borderRadius: "999px",
                      display: "flex",
                      height: "9px",
                      width: "76px"
                    }}
                  />
                  <div
                    style={{
                      background: "rgba(108, 98, 88, 0.18)",
                      borderRadius: "999px",
                      display: "flex",
                      height: "7px",
                      width: "100%"
                    }}
                  />
                  <div
                    style={{
                      background: "rgba(108, 98, 88, 0.18)",
                      borderRadius: "999px",
                      display: "flex",
                      height: "7px",
                      width: "88%"
                    }}
                  />
                </div>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <div
                    style={{
                      background: "#a86543",
                      borderRadius: "999px",
                      display: "flex",
                      height: "10px",
                      width: "10px"
                    }}
                  />
                  <div
                    style={{
                      color: "#6c6258",
                      display: "flex",
                      fontSize: "18px"
                    }}
                  >
                    Saved
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flex: "0 0 430px",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "20px"
              }}
            >
              <div
                style={{
                  color: "#7e654f",
                  display: "flex",
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  marginBottom: "24px",
                  textTransform: "uppercase"
                }}
              >
                {SITE_NAME}
              </div>
              <div
                style={{
                  color: "#201915",
                  display: "flex",
                  fontSize: "78px",
                  fontWeight: 700,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.96,
                  marginBottom: "26px",
                  whiteSpace: "pre-wrap"
                }}
              >
                {"Resume,\nrefined."}
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: "12px"
                }}
              >
                <div
                  style={{
                    background: "#a86543",
                    borderRadius: "999px",
                    display: "flex",
                    height: "12px",
                    width: "12px"
                  }}
                />
                <div
                  style={{
                    color: "#6c6258",
                    display: "flex",
                    fontSize: "24px",
                    fontWeight: 500
                  }}
                >
                  Build. Save. Export.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          data: regular,
          name: "Noto Sans KR",
          style: "normal",
          weight: 400
        },
        {
          data: bold,
          name: "Noto Sans KR",
          style: "normal",
          weight: 700
        }
      ]
    }
  );
}
