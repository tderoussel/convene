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
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17.5 6.5C16 5 14 4 12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c2 0 3.5-.5 5.5-2.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
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
          Convene
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
