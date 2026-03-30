import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090B",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80",
            height: "80",
            background: "#DC2626",
            borderRadius: "16",
            marginBottom: "32",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M16 4L7 28H11.5L13.5 22.5H18.5L20.5 28H25L16 4Z"
              fill="white"
            />
            <line x1="12.5" y1="19" x2="19.5" y2="19" stroke="#DC2626" strokeWidth="2" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64",
            fontWeight: "700",
            color: "#FAFAFA",
            letterSpacing: "-2",
            marginBottom: "16",
          }}
        >
          Alyned
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24",
            color: "#A1A1AA",
            fontWeight: "400",
            maxWidth: "600",
            textAlign: "center",
            lineHeight: "1.4",
          }}
        >
          Where ambitious builders connect.
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4",
            background: "#DC2626",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
