"use client";

import type { ReactNode } from "react";

export function Pill({
  active,
  onClick,
  accent = false,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-200",
        active
          ? "border-ink bg-ink font-semibold text-white"
          : accent
            ? "border-mint bg-mint-wash font-semibold text-mint-ink hover:-translate-y-px"
            : "border-edge bg-card font-medium text-muted hover:-translate-y-px hover:border-lav hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function PillGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {children}
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-full border border-edge bg-ground p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={[
            "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200",
            value === option.value
              ? "-translate-y-px bg-card text-ink shadow-soft"
              : "text-muted hover:text-ink",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
