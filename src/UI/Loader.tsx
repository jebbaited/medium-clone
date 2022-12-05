import React from "react";

export const Loader = () => (
  <>
    <div className="flex justify-center mb-10 mt-10 h-[100vh]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-dotted rounded-full animate-spin border-top-color:transparent" />
      <p className="ml-3">Loading...</p>
    </div>
  </>
);
