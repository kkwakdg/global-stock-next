"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ModalWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={() => router.back()}
      role="presentation"
    >
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-lg border border-black/5 bg-white p-5 text-neutral-950 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="grid h-9 w-9 place-items-center rounded-md bg-neutral-950/[0.06] text-xl font-medium text-neutral-600 transition hover:bg-neutral-950/[0.1]"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
