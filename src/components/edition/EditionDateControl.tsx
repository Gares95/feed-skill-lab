"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type DateRange } from "@/lib/date-range";
import type { DateRangeSelection } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const PRESETS: { range: DateRange; label: string; hint: string }[] = [
  { range: "today", label: "Today", hint: "Today's edition" },
  { range: "week", label: "This week", hint: "Past 7 days" },
  { range: "month", label: "This month", hint: "Past 30 days" },
  { range: "all", label: "All editions", hint: "Everything" },
];

const TRIGGER_LABEL: Record<DateRange, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  all: "All editions",
  custom: "Custom range",
};

interface EditionDateControlProps {
  range: DateRange;
  onChange: (next: DateRangeSelection) => void;
  variant?: "desktop" | "mobile";
}

export function EditionDateControl({
  range,
  onChange,
  variant = "desktop",
}: EditionDateControlProps) {
  const [open, setOpen] = useState(false);

  function selectPreset(preset: DateRange) {
    onChange({ range: preset });
    setOpen(false);
  }

  const triggerClass =
    variant === "mobile"
      ? cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3",
          "border border-[color:var(--edition-rule-strong)]",
          "edition-eyebrow text-[0.62rem]",
          "text-[color:var(--edition-ink-muted)]",
          "transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
        )
      : cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3",
          "border border-[color:var(--edition-rule-strong)]",
          "edition-eyebrow text-[0.62rem]",
          "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
          "hover:border-[color:var(--edition-accent)]/60",
          "transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
        );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={triggerClass}
            aria-label={`Edition range: ${TRIGGER_LABEL[range]}. Change`}
            title="Change edition range"
          >
            <span className="tracking-[0.14em]">
              {TRIGGER_LABEL[range]}
            </span>
            <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
          </button>
        }
      />
      <PopoverContent
        align="end"
        className={cn(
          "w-56 p-1.5",
          "bg-[color:var(--edition-paper)] text-[color:var(--edition-ink)]",
          "border border-[color:var(--edition-rule-strong)]",
        )}
      >
        <p className="edition-eyebrow px-2 pb-1.5 pt-1 text-[0.6rem] text-[color:var(--edition-ink-faint)]">
          Edition range
        </p>
        <ul className="flex flex-col gap-0.5">
          {PRESETS.map((preset) => {
            const active = range === preset.range;
            return (
              <li key={preset.range}>
                <button
                  type="button"
                  onClick={() => selectPreset(preset.range)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 rounded-sm px-2 py-1.5",
                    "text-left text-sm transition-colors outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
                    active
                      ? "text-[color:var(--edition-accent)]"
                      : "text-[color:var(--edition-ink)] hover:text-[color:var(--edition-accent)]",
                  )}
                >
                  <span className="edition-display tracking-[-0.005em]">
                    {preset.label}
                  </span>
                  <span className="edition-stamp text-[0.62rem] text-[color:var(--edition-ink-faint)]">
                    {preset.hint}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {range === "custom" && (
          <p className="edition-stamp mt-1 border-t border-[color:var(--edition-rule)] px-2 pt-1.5 text-[0.62rem] text-[color:var(--edition-ink-faint)]">
            Custom range active. Pick a preset to reset.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
