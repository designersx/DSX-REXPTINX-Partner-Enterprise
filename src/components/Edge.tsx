"use client";

import React from "react";

export function Edge({ from, to }: any) {
  if (!from || !to) return null;
  const path = `M ${from.x + 100},${from.y + 50} L ${to.x + 100},${to.y}`;
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <path d={path} stroke="#1976d2" strokeWidth={2} fill="none" />
    </svg>
  );
}
