// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log para debug
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  const message = error?.message ?? "Ocurrió un error inesperado.";

  return (
    <html>
      <body
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(to top, #f1ece1 0%, #d6cfc0 40%, #c7c0b3 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "90%",
            background: "white",
            color: "#0f172a",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            border: "1px solid #e5e7eb",
            padding: 24,
          }}
        >
          <h1 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>
            Algo salió mal
          </h1>
          <p style={{ marginTop: 8, color: "#475569" }}>{message}</p>

          {error?.digest && (
            <p style={{ marginTop: 8, color: "#64748b", fontSize: 12 }}>
              Código: {error.digest}
            </p>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              onClick={() => reset()}
              style={{
                borderRadius: 999,
                background: "#fbbf24",
                color: "#111827",
                fontWeight: 600,
                padding: "10px 16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>

            <a
              href="/"
              style={{
                borderRadius: 999,
                padding: "10px 16px",
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                color: "#0f172a",
                fontWeight: 500,
              }}
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
