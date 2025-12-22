// components/AuthLayout.jsx
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT - FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          {children}
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-indigo-50">
          <img
            src="/designer_life.svg"
            alt="auth"
            className="max-w-[320px] w-full h-auto"
          />
        </div>

      </div>
    </div>
  );
}
