"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
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
          {isLoading && !article ? (
            <EditionStorySkeleton />
          ) : !article ? (
            <EditionStoryError onBack={onBack} />
          ) : (
            <ReadingPane
              article={article}
              isLoading={isLoading}
              onToggleStar={onToggleStar}
            />
          )}
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

function EditionStorySkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading story"
      className="pt-6"
    >
      <div className="edition-skeleton-line h-3 w-24" />
      <div className="mt-5 edition-skeleton-line edition-skeleton-headline h-9 w-[88%]" />
      <div className="mt-2 edition-skeleton-line edition-skeleton-headline h-9 w-[72%]" />
      <div className="mt-2 edition-skeleton-line edition-skeleton-headline h-9 w-[58%]" />
      <div className="mt-6 edition-skeleton-line h-2.5 w-40" />
      <div className="mt-10 space-y-3">
        <div className="edition-skeleton-line h-3 w-full" />
        <div className="edition-skeleton-line h-3 w-[96%]" />
        <div className="edition-skeleton-line h-3 w-[91%]" />
        <div className="edition-skeleton-line h-3 w-[78%]" />
      </div>
      <span className="sr-only">Loading story…</span>
    </div>
  );
}

function EditionStoryError({ onBack }: { onBack: () => void }) {
  return (
    <div role="alert" className="pt-6">
      <p className="edition-eyebrow text-[0.7rem]">Stop press</p>
      <h2 className="edition-display mt-3 text-[length:var(--edition-display-second)] font-semibold leading-[1.15] tracking-[-0.012em] text-balance text-[color:var(--edition-ink)]">
        This story didn’t make it to print.
      </h2>
      <p className="edition-dek mt-4">
        We couldn’t load the article. The source may be offline, the link may
        have moved, or the connection failed mid-fetch.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={cn(
            "edition-eyebrow inline-flex items-center gap-2 text-[0.72rem]",
            "text-[color:var(--edition-accent)] hover:text-[color:var(--edition-accent-strong)]",
            "transition-colors outline-none rounded-sm",
            "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
          )}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Try again</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          className="edition-stamp text-[0.68rem] text-[color:var(--edition-ink-faint)] hover:text-[color:var(--edition-ink-muted)] transition-colors outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60"
        >
          Back to edition →
        </button>
      </div>
    </div>
  );
}
