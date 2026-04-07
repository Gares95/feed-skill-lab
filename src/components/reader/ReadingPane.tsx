"use client";

import { useEffect, useState } from "react";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArticleHeader } from "./ArticleHeader";
import {
  TypographySettings,
  useTypography,
} from "./TypographySettings";
import { extractArticle } from "@/actions/reader";

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
  onToggleStar: (articleId: string) => void;
}

export function ReadingPane({ article, onToggleStar }: ReadingPaneProps) {
  const { config, update } = useTypography();
  const [readerMode, setReaderMode] = useState(false);
  const [readerContent, setReaderContent] = useState<string | null>(null);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);

  // Reset reader cache when switching articles
  useEffect(() => {
    setReaderMode(false);
    setReaderContent(null);
    setReaderError(null);
    setReaderLoading(false);
  }, [article?.id]);

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
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <BookOpen className="h-8 w-8" />
        <p className="text-sm">Select an article to read</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-8 items-center justify-end gap-1 border-b px-3">
        <Button
          variant={readerMode ? "secondary" : "ghost"}
          size="sm"
          className="h-6 gap-1.5 px-2 text-xs"
          onClick={toggleReaderMode}
          disabled={readerLoading}
          title={readerMode ? "Show original feed content" : "Reader mode"}
        >
          {readerLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          Reader
        </Button>
        <TypographySettings config={config} onUpdate={update} />
      </div>
      <ScrollArea className="flex-1">
        <article
          className="mx-auto px-8 py-8"
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
          />
          {readerError && (
            <p className="mt-6 text-sm text-destructive">
              Reader mode failed: {readerError}
            </p>
          )}
          <div
            className="article-content mt-6"
            style={{
              fontSize: `${config.fontSize}px`,
              lineHeight: config.lineHeight,
            }}
            dangerouslySetInnerHTML={{
              __html:
                readerMode && readerContent ? readerContent : article.content,
            }}
          />
        </article>
      </ScrollArea>
    </div>
  );
}
