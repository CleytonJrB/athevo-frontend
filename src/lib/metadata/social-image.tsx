import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

export const socialImageSize = {
  width: 1200,
  height: 630,
}

export const socialImageContentType = "image/png"

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: siteConfig.themeColor,
          color: "#e2e2e2",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          padding: "72px 84px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle, rgba(250, 204, 21, 0.22) 0%, rgba(250, 204, 21, 0) 68%)",
            display: "flex",
            height: 720,
            position: "absolute",
            right: -180,
            top: -230,
            width: 720,
          }}
        />
        <div
          style={{
            border: "1px solid rgba(250, 204, 21, 0.16)",
            borderRadius: 44,
            display: "flex",
            height: 450,
            position: "absolute",
            right: -80,
            transform: "rotate(24deg)",
            width: 450,
          }}
        />

        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            gap: 34,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              gap: 18,
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#facc15",
                borderRadius: 14,
                color: "#09090b",
                display: "flex",
                fontSize: 30,
                height: 58,
                justifyContent: "center",
                width: 58,
              }}
            >
              A
            </div>
            {siteConfig.name}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                display: "flex",
                fontSize: 68,
                fontWeight: 750,
                letterSpacing: "-0.055em",
                lineHeight: 1.04,
              }}
            >
              Gestão precisa para academias
            </div>
            <div
              style={{
                color: "#a1a1aa",
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                maxWidth: 840,
              }}
            >
              Alunos, treinos, exercícios e finanças em uma plataforma completa.
            </div>
          </div>

          <div
            style={{
              background: "#facc15",
              borderRadius: 999,
              display: "flex",
              height: 8,
              width: 96,
            }}
          />
        </div>
      </div>
    ),
    socialImageSize,
  )
}
