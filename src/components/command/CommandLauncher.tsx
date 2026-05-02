"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface CommandLauncherProps {
  onClick: () => void;
  className?: string;
  hint?: string;
}

export function CommandLauncher({
  onClick,
  className,
  hint = "Run a command, jump to a feed",
}: CommandLauncherProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open command palette"
      className={cn(
        "group inline-flex h-7 items-center gap-2 rounded-full border border-border/60 bg-card/60 pl-2.5 pr-1.5 text-[12px] text-muted-foreground/90 transition-colors outline-none hover:border-border hover:bg-card hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60",
        className,
      )}
    >
      <Search
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
        aria-hidden="true"
      />
      <span className="truncate">{hint}</span>
      <KbdGroup className="ml-1.5">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}
