"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Highlighter, Inspect, Maximize2, Minimize2, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ArticleHeader } from "./ArticleHeader";
import {
  TypographySettings,
  useTypography,
} from "./TypographySettings";
import { extractArticle } from "@/actions/reader";
import {
  addHighlight,
  deleteHighlight,
  getHighlights,
  updateHighlightNote,
} from "@/actions/highlights";
import {
  applyHighlights,
  rangeTextOffset,
  type HighlightRecord,
} from "@/lib/highlights";
import { cn } from "@/lib/utils";

export interface ArticleFull {
  id: string;
  title: string;
  content: string;
  link: string;
  author: string | null;
  publishedAt: Date;
  isStarred: boolean;
  feedTitle: string;
}

interface ReadingPaneProps {
  article: ArticleFull | null;
  isLoading?: boolean;
  onToggleStar: (articleId: string) => void;
}

export function ReadingPane({ article, isLoading = false, onToggleStar }: ReadingPaneProps) {
  const { config, update } = useTypography();
  const [readerMode, setReaderMode] = useState(false);
  const [readerContent, setReaderContent] = useState<string | null>(null);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [highlights, setHighlights] = useState<HighlightRecord[]>([]);
  const [selection, setSelection] = useState<{
    text: string;
    offset: number;
    rect: DOMRect;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset reader cache when switching articles
  useEffect(() => {
    setReaderMode(false);
    setReaderContent(null);
    setReaderError(null);
    setReaderLoading(false);
    setSelection(null);
    setHighlights([]);
    if (article?.id) {
      getHighlights(article.id).then((rows) =>
        setHighlights(
          rows.map((r) => ({
            id: r.id,
            text: r.text,
            textOffset: r.textOffset,
            note: r.note,
          })),
        ),
      );
    }
  }, [article?.id]);

  // Apply highlights to the rendered content. Re-runs whenever the rendered
  // HTML or the highlight set changes. Highlights only persist for the
  // original feed content, not reader-mode-extracted content (different DOM).
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    if (readerMode) return;
    if (highlights.length === 0) return;
    applyHighlights(node, highlights);
  }, [highlights, readerMode, article?.id, article?.content]);

  // Hide any image that fails to load (dead CDN, 404 from proxy, etc.) so we
  // never show a broken-image icon. Re-runs whenever rendered content changes.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const imgs = node.querySelectorAll("img");
    const hide = (img: HTMLImageElement) => {
      img.style.display = "none";
    };
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth === 0) {
        hide(img);
        return;
      }
      img.addEventListener("error", () => hide(img), { once: true });
    });
  }, [readerMode, readerContent, article?.id, article?.content]);

  // `f` toggles focus mode when an article is loaded. Skips inputs and the
  // contentEditable highlight surface so it never blocks typing.
  useEffect(() => {
    if (!article) return;
    function handle(e: KeyboardEvent) {
      if (e.key !== "f" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setFocusMode((prev) => !prev);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [article]);

  const handleMouseUp = useCallback(() => {
    if (readerMode) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setSelection(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const node = contentRef.current;
    if (!node || !node.contains(range.startContainer)) {
      setSelection(null);
      return;
    }
    const text = sel.toString();
    if (!text.trim()) {
      setSelection(null);
      return;
    }
    const offset = rangeTextOffset(node, range);
    if (offset < 0) {
      setSelection(null);
      return;
    }
    setSelection({ text, offset, rect: range.getBoundingClientRect() });
  }, [readerMode]);

  async function saveHighlight() {
    if (!article || !selection) return;
    const created = await addHighlight({
      articleId: article.id,
      text: selection.text,
      textOffset: selection.offset,
    });
    setHighlights((prev) => [
      ...prev,
      {
        id: created.id,
        text: created.text,
        textOffset: created.textOffset,
        note: created.note,
      },
    ]);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }

  async function removeHighlight(id: string) {
    await deleteHighlight(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }

  async function saveNote(id: string, note: string) {
    const trimmed = note.trim() || null;
    await updateHighlightNote(id, trimmed);
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note: trimmed } : h)),
    );
  }

  async function toggleReaderMode() {
    if (!article) return;
    if (readerMode) {
      setReaderMode(false);
      return;
    }
    setReaderMode(true);
    if (readerContent || readerLoading) return;
    setReaderLoading(true);
    setReaderError(null);
    try {
      const result = await extractArticle(article.id);
      setReaderContent(result.content);
    } catch (e) {
      setReaderError(e instanceof Error ? e.message : "Failed to extract");
    } finally {
      setReaderLoading(false);
    }
  }

  if (!article) {
    if (isLoading) {
      return <ReadingPaneSkeleton maxWidth={config.maxWidth} />;
    }
    return <InspectorEmptyState />;
  }

  const contentMaxWidth = focusMode
    ? Math.min(config.maxWidth + 80, 880)
    : config.maxWidth;

  return (
    <div role="region" aria-label="Reading pane" className="flex h-full flex-col bg-[var(--cockpit-inspector-bg)]">
      <InspectorToolbar
        feedTitle={article.feedTitle}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode((p) => !p)}
        config={config}
        onUpdateConfig={update}
      />
      <ScrollArea className="flex-1">
        <article
          className={cn(
            "mx-auto px-6 transition-[max-width,padding] duration-[var(--motion-base)] ease-[var(--ease-out-quint)] sm:px-8",
            focusMode ? "py-10 sm:py-14" : "py-7",
          )}
          style={{ maxWidth: `${contentMaxWidth}px` }}
        >
          <ArticleHeader
            title={article.title}
            author={article.author}
            publishedAt={article.publishedAt}
            feedTitle={article.feedTitle}
            link={article.link}
            content={article.content}
            isStarred={article.isStarred}
            onToggleStar={() => onToggleStar(article.id)}
            readerMode={readerMode}
            readerLoading={readerLoading}
            onToggleReader={toggleReaderMode}
            density={focusMode ? "focus" : "inspect"}
          />
          {readerError && (
            <p
              className="cockpit-mono mt-5 inline-flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-destructive"
              role="alert"
            >
              Reader extraction failed — {readerError}
            </p>
          )}
          <div
            key={`${article.id}:${readerMode ? "reader" : "feed"}`}
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className={cn(
              "article-content animate-in fade-in-0 duration-[var(--motion-base)] ease-[var(--ease-out-quint)]",
              focusMode ? "mt-8" : "mt-6",
            )}
            style={{
              fontSize: `${config.fontSize}px`,
              lineHeight: config.lineHeight,
            }}
            dangerouslySetInnerHTML={{
              __html:
                readerMode && readerContent ? readerContent : article.content,
            }}
          />
          {highlights.length > 0 && !readerMode && (
            <div className="mt-12 border-t border-border/60 pt-6">
              <h3 className="cockpit-mono mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Highlighter
                  className="h-3 w-3 text-[var(--cockpit-accent)]"
                  aria-hidden="true"
                />
                Highlights
                <span className="tabular-nums text-foreground/70">
                  {highlights.length.toString().padStart(2, "0")}
                </span>
              </h3>
              <ul className="flex flex-col gap-2">
                {highlights
                  .slice()
                  .sort((a, b) => a.textOffset - b.textOffset)
                  .map((h) => (
                    <HighlightItem
                      key={h.id}
                      highlight={h}
                      onDelete={() => removeHighlight(h.id)}
                      onSaveNote={(note) => saveNote(h.id, note)}
                    />
                  ))}
              </ul>
            </div>
          )}
        </article>
      </ScrollArea>
      {selection && (
        <button
          type="button"
          onClick={saveHighlight}
          className="cockpit-mono fixed z-50 inline-flex items-center gap-1.5 rounded-sm border border-[color-mix(in_oklch,var(--cockpit-accent)_38%,transparent)] bg-[color-mix(in_oklch,var(--cockpit-accent)_18%,var(--popover))] px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--cockpit-accent)] shadow-md transition-colors hover:bg-[color-mix(in_oklch,var(--cockpit-accent)_28%,var(--popover))]"
          style={{
            top: selection.rect.top - 36,
            left: selection.rect.left + selection.rect.width / 2 - 56,
          }}
        >
          <Highlighter className="h-3 w-3" aria-hidden="true" />
          Highlight
        </button>
      )}
    </div>
  );
}

interface InspectorToolbarProps {
  feedTitle: string;
  focusMode: boolean;
  onToggleFocus: () => void;
  config: ReturnType<typeof useTypography>["config"];
  onUpdateConfig: ReturnType<typeof useTypography>["update"];
}

function InspectorToolbar({
  feedTitle,
  focusMode,
  onToggleFocus,
  config,
  onUpdateConfig,
}: InspectorToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-3 border-b border-border/50 px-3 text-[11px] transition-colors",
        focusMode ? "bg-transparent" : "bg-[var(--cockpit-inspector-bg)]",
      )}
    >
      <span className="cockpit-mono inline-flex items-center gap-1.5 uppercase tracking-[0.18em]">
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            focusMode
              ? "bg-[var(--cockpit-accent)]"
              : "bg-[color-mix(in_oklch,var(--cockpit-accent)_55%,transparent)]",
          )}
        />
        <span
          className={cn(
            focusMode ? "text-[var(--cockpit-accent)]" : "text-foreground/80",
          )}
        >
          {focusMode ? "Focus" : "Inspect"}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="text-muted-foreground/40 cockpit-mono"
      >
        ›
      </span>
      <span className="cockpit-mono flex-1 truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {feedTitle}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onToggleFocus}
        aria-pressed={focusMode}
        aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
        title={focusMode ? "Exit focus mode (f)" : "Focus mode (f)"}
      >
        {focusMode ? (
          <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{focusMode ? "Inspect" : "Focus"}</span>
        <Kbd className="ml-0.5 hidden sm:inline-flex" aria-hidden="true">
          F
        </Kbd>
      </Button>

      <TypographySettings config={config} onUpdate={onUpdateConfig} />
    </div>
  );
}

function InspectorEmptyState() {
  return (
    <div
      role="region"
      aria-label="Reading pane"
      className="flex h-full flex-col items-center justify-center gap-4 bg-[var(--cockpit-inspector-bg)] px-8 text-center"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-md border border-border/60 bg-[color-mix(in_oklch,var(--cockpit-accent)_8%,transparent)] text-[var(--cockpit-accent)]"
      >
        <Inspect className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="cockpit-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Inspector idle
        </p>
        <p className="text-sm text-foreground/80">No article selected.</p>
      </div>
      <div className="cockpit-mono flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <KbdGroup>
            <Kbd>J</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          navigate queue
        </span>
        <span aria-hidden="true" className="text-muted-foreground/40">·</span>
        <span className="inline-flex items-center gap-1.5">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          palette
        </span>
      </div>
    </div>
  );
}

function ReadingPaneSkeleton({ maxWidth }: { maxWidth: number }) {
  return (
    <div
      className="flex h-full flex-col bg-[var(--cockpit-inspector-bg)]"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading article…</span>
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border/50 px-3">
        <span className="cockpit-mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color-mix(in_oklch,var(--cockpit-accent)_55%,transparent)]"
          />
          Inspect
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="mx-auto animate-pulse px-6 py-7 sm:px-8 [animation-duration:1.6s]"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div className="space-y-3 border-b border-border/50 pb-5">
            <div className="h-2.5 w-24 rounded-sm bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-11/12 rounded-sm bg-muted" />
              <div className="h-5 w-3/5 rounded-sm bg-muted" />
            </div>
            <div className="flex gap-2">
              <div className="h-2.5 w-16 rounded-sm bg-muted/70" />
              <div className="h-2.5 w-20 rounded-sm bg-muted/70" />
              <div className="h-2.5 w-14 rounded-sm bg-muted/70" />
            </div>
            <div className="flex gap-1.5 pt-1">
              <div className="h-7 w-20 rounded-sm bg-muted/80" />
              <div className="h-7 w-14 rounded-sm bg-muted/60" />
              <div className="h-7 w-24 rounded-sm bg-muted/40" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3.5 w-full rounded-sm bg-muted/70" />
            <div className="h-3.5 w-11/12 rounded-sm bg-muted/70" />
            <div className="h-3.5 w-10/12 rounded-sm bg-muted/70" />
            <div className="h-3.5 w-full rounded-sm bg-muted/70" />
            <div className="h-3.5 w-9/12 rounded-sm bg-muted/70" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3.5 w-full rounded-sm bg-muted/70" />
            <div className="h-3.5 w-11/12 rounded-sm bg-muted/70" />
            <div className="h-3.5 w-7/12 rounded-sm bg-muted/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HighlightItemProps {
  highlight: HighlightRecord;
  onDelete: () => void;
  onSaveNote: (note: string) => void | Promise<void>;
}

function HighlightItem({ highlight, onDelete, onSaveNote }: HighlightItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(highlight.note ?? "");

  function startEdit() {
    setDraft(highlight.note ?? "");
    setEditing(true);
  }

  async function commit() {
    setEditing(false);
    if ((draft.trim() || null) !== (highlight.note ?? null)) {
      await onSaveNote(draft);
    }
  }

  return (
    <li className="group relative flex flex-col gap-2 rounded-sm border border-border/50 bg-[color-mix(in_oklch,var(--cockpit-accent)_4%,var(--card))] py-2.5 pl-3 pr-2.5 text-sm">
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-0 w-[2px] rounded-sm bg-[color-mix(in_oklch,var(--cockpit-accent)_50%,transparent)]"
      />
      <div className="flex items-start gap-2">
        <span className="flex-1 italic text-foreground/90">“{highlight.text}”</span>
        <button
          type="button"
          onClick={startEdit}
          className="rounded-sm p-0.5 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label={highlight.note ? "Edit note" : "Add note"}
          title={highlight.note ? "Edit note" : "Add note"}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-sm p-0.5 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
          aria-label="Delete highlight"
          title="Delete highlight"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setEditing(false);
              setDraft(highlight.note ?? "");
            }
          }}
          placeholder="Add a note…"
          className="min-h-[60px] w-full resize-y rounded-sm border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-[var(--cockpit-accent)]"
        />
      ) : (
        highlight.note && (
          <p
            className="cursor-text rounded-sm text-xs text-muted-foreground hover:text-foreground"
            onClick={startEdit}
          >
            {highlight.note}
          </p>
        )
      )}
    </li>
  );
}
