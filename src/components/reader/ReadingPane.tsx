"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Highlighter, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return (
      <div role="region" aria-label="Reading pane" className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-muted-foreground">
        <BookOpen className="h-8 w-8" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Nothing selected</p>
          <p className="text-xs">Pick an article from the list to start reading.</p>
        </div>
      </div>
    );
  }

  return (
    <div role="region" aria-label="Reading pane" className="relative flex h-full flex-col">
      <div className="pointer-events-none absolute right-3 top-3 z-30 opacity-60 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] hover:opacity-100 focus-within:opacity-100 [&>*]:pointer-events-auto">
        <TypographySettings config={config} onUpdate={update} />
      </div>
      <ScrollArea className="flex-1">
        <article
          className="mx-auto px-5 pb-16 pt-8 sm:px-8 sm:pt-14"
          style={{ maxWidth: `${config.maxWidth}px` }}
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
          />
          {readerError && (
            <p className="mt-6 text-sm text-destructive">
              Reader mode failed: {readerError}
            </p>
          )}
          <div
            key={`${article.id}:${readerMode ? "reader" : "feed"}`}
            ref={contentRef}
            onMouseUp={handleMouseUp}
            className="article-content mt-2 animate-in fade-in-0 duration-[var(--motion-base)] ease-[var(--ease-out-quint)]"
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
            <div className="mt-14 border-t border-border/50 pt-8">
              <h3 className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span>Highlights</span>
                <span aria-hidden="true" className="h-px flex-1 bg-border/50" />
                <span className="tabular-nums text-muted-foreground/70">{highlights.length}</span>
              </h3>
              <ul className="flex flex-col gap-5">
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
          className="fixed z-50 flex items-center gap-1.5 rounded-full border border-border/60 bg-popover px-3 py-1.5 text-[12px] font-medium text-popover-foreground shadow-md transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] hover:bg-accent"
          style={{
            top: selection.rect.top - 36,
            left: selection.rect.left + selection.rect.width / 2 - 50,
          }}
        >
          <Highlighter className="h-3 w-3" />
          Highlight
        </button>
      )}
    </div>
  );
}

function ReadingPaneSkeleton({ maxWidth }: { maxWidth: number }) {
  return (
    <div
      className="flex h-full flex-col"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading article…</span>
      <div className="flex-1 overflow-hidden">
        <div
          className="mx-auto animate-pulse px-5 pb-16 pt-8 [animation-duration:1.6s] sm:px-8 sm:pt-14"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div className="space-y-5 pb-6">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-7 w-11/12 rounded bg-muted" />
                <div className="h-7 w-3/5 rounded bg-muted" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-20 rounded bg-muted/70" />
              <div className="h-3 w-24 rounded bg-muted/70" />
              <div className="h-3 w-16 rounded bg-muted/70" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-28 rounded-md bg-muted/80" />
              <div className="h-8 w-16 rounded-md bg-muted/60" />
              <div className="h-8 w-28 rounded-md bg-muted/40" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-muted/70" />
            <div className="h-4 w-11/12 rounded bg-muted/70" />
            <div className="h-4 w-10/12 rounded bg-muted/70" />
            <div className="h-4 w-full rounded bg-muted/70" />
            <div className="h-4 w-9/12 rounded bg-muted/70" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-muted/70" />
            <div className="h-4 w-11/12 rounded bg-muted/70" />
            <div className="h-4 w-7/12 rounded bg-muted/70" />
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
    <li className="group flex flex-col gap-2 border-l-2 border-star/60 pl-4 text-sm">
      <div className="flex items-start gap-2">
        <span className="flex-1 italic leading-[1.55] text-foreground/90">“{highlight.text}”</span>
        <button
          type="button"
          onClick={startEdit}
          className="opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded"
          aria-label={highlight.note ? "Edit note" : "Add note"}
          title={highlight.note ? "Edit note" : "Add note"}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 rounded"
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
          className="min-h-[60px] w-full resize-y rounded-md border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-primary"
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
