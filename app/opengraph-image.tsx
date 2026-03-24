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

const lineWidths = ["100%", "84%", "74%", "92%", "68%"];
const summaryLines = ["92%", "86%", "72%", "80%"];

export default async function OpenGraphImage() {
  const [regular, bold] = await Promise.all([regularFont, boldFont]);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 84%, rgba(161,49,40,0.28), transparent 34%), radial-gradient(circle at 82% 18%, rgba(104,95,255,0.18), transparent 28%), linear-gradient(180deg, #090B10 0%, #06070B 56%, #05060A 100%)",
          color: "#F3F5F8",
          display: "flex",
          flex: 1,
          fontFamily: '"Noto Sans KR"',
          overflow: "hidden",
          padding: "52px 72px",
          position: "relative"
        }}
      >
        <div
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.024) 0 1px, transparent 1px 96px), repeating-linear-gradient(180deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 96px)",
            inset: 0,
            opacity: 0.12,
            position: "absolute"
          }}
        />
        <div
          style={{
            background: "radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.34) 100%)",
            inset: 0,
            position: "absolute"
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            gap: "52px",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              position: "relative",
              width: "430px"
            }}
          >
            <div
              style={{
                background: "radial-gradient(circle at center, rgba(161,49,40,0.26), transparent 70%)",
                display: "flex",
                height: "360px",
                left: "10px",
                position: "absolute",
                top: "220px",
                width: "360px"
              }}
            />
            <div
              style={{
                background: "radial-gradient(circle at center, rgba(104,95,255,0.18), transparent 68%)",
                display: "flex",
                height: "300px",
                position: "absolute",
                right: "0",
                top: "28px",
                width: "300px"
              }}
            />
            <div
              style={{
                alignItems: "center",
                background: "rgba(14, 17, 23, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "42px",
                boxShadow: "0 34px 84px rgba(0,0,0,0.44)",
                display: "flex",
                height: "460px",
                justifyContent: "center",
                position: "relative",
                transform: "rotate(-7deg)",
                width: "352px"
              }}
            >
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
                  borderRadius: "42px",
                  inset: 0,
                  position: "absolute"
                }}
              />
              <div
                style={{
                  background: "rgba(246, 243, 236, 0.72)",
                  border: "1px solid rgba(255,255,255,0.42)",
                  borderRadius: "28px",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
                  display: "flex",
                  height: "338px",
                  position: "absolute",
                  right: "58px",
                  top: "44px",
                  transform: "rotate(8deg)",
                  width: "238px"
                }}
              />
              <div
                style={{
                  alignItems: "stretch",
                  background: "#F6F3EC",
                  border: "1px solid rgba(26,31,41,0.06)",
                  borderRadius: "30px",
                  boxShadow: "0 22px 54px rgba(0,0,0,0.26)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  height: "356px",
                  padding: "30px",
                  position: "relative",
                  width: "248px"
                }}
              >
                <div
                  style={{
                    background: "#E6DED1",
                    clipPath: "polygon(0 0, 100% 0, 100% 42%, 58% 42%, 58% 100%, 0 100%)",
                    height: "58px",
                    position: "absolute",
                    right: "0",
                    top: "0",
                    width: "58px"
                  }}
                />
                <div
                  style={{
                    borderLeft: "1px solid rgba(26,31,41,0.08)",
                    borderTop: "1px solid rgba(26,31,41,0.08)",
                    height: "24px",
                    position: "absolute",
                    right: "9px",
                    top: "9px",
                    transform: "rotate(0deg)",
                    width: "24px"
                  }}
                />
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "14px"
                  }}
                >
                  <div
                    style={{
                      background: "#E2D9CC",
                      borderRadius: "999px",
                      display: "flex",
                      height: "50px",
                      width: "50px"
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      gap: "8px"
                    }}
                  >
                    <div
                      style={{
                        background: "#1A1F29",
                        borderRadius: "999px",
                        display: "flex",
                        height: "12px",
                        width: "116px"
                      }}
                    />
                    <div
                      style={{
                        background: "rgba(26,31,41,0.18)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "8px",
                        width: "86px"
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    background: "#ECE4D8",
                    borderRadius: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "16px"
                  }}
                >
                  <div
                    style={{
                      background: "#D8CCBC",
                      borderRadius: "999px",
                      display: "flex",
                      height: "8px",
                      width: "62px"
                    }}
                  />
                  {summaryLines.map((width) => (
                    <div
                      key={width}
                      style={{
                        background: "rgba(26,31,41,0.12)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "7px",
                        width
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  {lineWidths.map((width) => (
                    <div
                      key={width}
                      style={{
                        background: "rgba(26,31,41,0.14)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "10px",
                        width: width === "100%" ? "10px" : width
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
                        background: "#EFE7DA",
                        borderRadius: "14px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: "8px",
                        height: "82px",
                        padding: "12px"
                      }}
                    >
                      <div
                        style={{
                          background: "#D8CCBC",
                          borderRadius: "999px",
                          display: "flex",
                          height: "8px",
                          width: "40px"
                        }}
                      />
                      <div
                        style={{
                          background: "rgba(26,31,41,0.12)",
                          borderRadius: "999px",
                          display: "flex",
                          height: "7px",
                          width: "100%"
                        }}
                      />
                      <div
                        style={{
                          background: "rgba(26,31,41,0.12)",
                          borderRadius: "999px",
                          display: "flex",
                          height: "7px",
                          width: "74%"
                        }}
                      />
                    </div>
                  <div
                    style={{
                      background: "#EFE7DA",
                      borderRadius: "14px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: "8px",
                      height: "82px",
                      padding: "12px"
                    }}
                  >
                    <div
                      style={{
                        background: "#D8CCBC",
                        borderRadius: "999px",
                        display: "flex",
                        height: "8px",
                        width: "40px"
                      }}
                    />
                    <div
                      style={{
                        background: "rgba(26,31,41,0.12)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "7px",
                        width: "94%"
                      }}
                    />
                    <div
                      style={{
                        background: "rgba(26,31,41,0.12)",
                        borderRadius: "999px",
                        display: "flex",
                        height: "7px",
                        width: "70%"
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(26,31,41,0.14)",
                    borderRadius: "999px",
                    display: "flex",
                    height: "8px",
                    width: "72%"
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "380px",
              position: "relative"
            }}
          >
            <div
              style={{
                color: "#C7CFDA",
                display: "flex",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                marginBottom: "20px",
                textTransform: "uppercase"
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "86px",
                fontWeight: 700,
                letterSpacing: "-0.07em",
                lineHeight: 0.9,
                textShadow: "0 10px 36px rgba(0,0,0,0.34)",
                whiteSpace: "pre-wrap"
              }}
            >
              {"Resume\nRoom"}
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
