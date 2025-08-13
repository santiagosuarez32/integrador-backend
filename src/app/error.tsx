"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    // Log completo en consola
    // Intenta serializar si es objeto simple
    try {
      console.error("App Error Boundary:", error, JSON.stringify(error));
    } catch {
      console.error("App Error Boundary:", error);
    }
  }, [error]);

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : (() => {
          try {
            return JSON.stringify(error);
          } catch {
            return String(error);
          }
        })();

  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 text-slate-900 shadow">
      <h2 className="text-xl font-bold">Ocurrió un error</h2>
      <p className="mt-2 text-sm text-red-600 break-words">{message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-full border px-4 py-2 text-sm hover:bg-slate-50"
      >
        Reintentar
      </button>
    </div>
  );
}
