"use client";

import dynamic from "next/dynamic";

const GuestTimer = dynamic(
  () => import("@/components/auth/GuestTimer").then((m) => ({ default: m.GuestTimer })),
  { ssr: false }
);

export function GuestTimerWrapper() {
  return <GuestTimer />;
}
