"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function MobileMenu({ role }: { role: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          md:hidden
          bg-violet-600
          text-white
          px-4
          py-3
          rounded-xl
          mb-4
        "
      >
        ☰ Menu
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 z-50">
          <div className="w-64 h-full">
            <button
              onClick={() => setOpen(false)}
              className="bg-red-600 text-white p-3 m-3 rounded-xl"
            >
              Fermer ✖
            </button>

            <Sidebar role={role} />
          </div>
        </div>
      )}
    </>
  );
}
