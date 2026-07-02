import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          color: "#f8f4ea",
          background: "#0b192b"
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          MOVE Colombia
        </div>
        <div style={{ marginTop: 30, maxWidth: 900, fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          Transporte Privado y Experiencias en Colombia
        </div>
        <div style={{ marginTop: 30, fontSize: 30, color: "#d7e8df" }}>
          Medellin | Bogota | Servicio premium
        </div>
      </div>
    ),
    size
  );
}
