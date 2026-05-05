"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReadingPane, type ArticleFull } from "@/components/reader/ReadingPane";
import type { ArticleWithFeed } from "@/components/articles/ArticleList";

interface EditionStoryDetailProps {
  article: ArticleFull | null;
  isLoading: boolean;
  onToggleStar: (articleId: string) => void;
  onBack: () => void;
  selectedArticleId: string | null;
  articles: ArticleWithFeed[];
  onSelectArticle: (articleId: string) => void;
}

export function EditionStoryDetail({
  article,
  isLoading,
  onToggleStar,
  onBack,
  selectedArticleId,
  articles,
  onSelectArticle,
}: EditionStoryDetailProps) {
  const backRef = useRef<HTMLButtonElement>(null);

  // Move focus to the back button on open so keyboard users land in the
  // detail surface, not stranded on the issue trigger.
  useEffect(() => {
    if (selectedArticleId) {
      backRef.current?.focus();
    }
  }, [selectedArticleId]);

  // Esc closes the detail and returns to the edition.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
          return;
        }
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const index = articles.findIndex((a) => a.id === selectedArticleId);
  const total = articles.length;

  return (
    <section
      role="region"
      aria-label="Story detail"
      className={cn(
        "edition-issue edition-scroll relative h-full w-full overflow-y-auto",
        "animate-in fade-in-0 duration-[var(--motion-base)] ease-[var(--ease-out-quint)]",
      )}
    >
      <div
        className={cn(
          "sticky top-0 z-10",
          "bg-[color:var(--edition-paper)]/90 backdrop-blur",
          "border-b border-[color:var(--edition-rule)]",
        )}
      >
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <button
            ref={backRef}
            type="button"
            onClick={onBack}
            className={cn(
              "edition-eyebrow inline-flex items-center gap-2 text-[0.7rem]",
              "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-accent)]",
              "transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 rounded-sm",
            )}
            aria-label="Back to edition"
            title="Back to edition (Esc)"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to edition</span>
          </button>
          {index >= 0 && total > 0 && (
            <span
              className="edition-stamp text-[0.68rem] text-[color:var(--edition-ink-faint)]"
              aria-label={`Story ${index + 1} of ${total}`}
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[860px] px-2 pb-24 sm:px-4 lg:px-6">
        <div className="edition-story">
          <ReadingPane
            article={article}
            isLoading={isLoading}
            onToggleStar={onToggleStar}
          />
        </div>
        {index >= 0 && index + 1 < total && (
          <div className="mt-10 border-t border-[color:var(--edition-rule)] pt-6">
            <p className="edition-eyebrow text-[0.68rem]">Up next</p>
            <button
              type="button"
              onClick={() => onSelectArticle(articles[index + 1].id)}
              className={cn(
                "group mt-2 block w-full text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 rounded-sm",
              )}
            >
              <h3
                className={cn(
                  "edition-display text-[length:var(--edition-display-second)]",
                  "leading-[1.15] tracking-[-0.012em] text-balance",
                  "text-[color:var(--edition-ink)] group-hover:text-[color:var(--edition-accent)] transition-colors",
                )}
              >
                {articles[index + 1].title}
              </h3>
              <p className="edition-stamp mt-2 text-[0.68rem] text-[color:var(--edition-ink-muted)]">
                {articles[index + 1].feedTitle}
              </p>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
