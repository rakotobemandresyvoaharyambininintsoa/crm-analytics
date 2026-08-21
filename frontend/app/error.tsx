"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-white p-10">
      <h1 className="text-4xl font-bold">
        Erreur CRM
      </h1>

      <p>
        Une erreur est survenue.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Réessayer
      </button>
    </div>
  )
}