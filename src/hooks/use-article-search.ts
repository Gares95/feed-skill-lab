"use client";

import { useEffect, useRef, useState } from "react";
import { searchArticles } from "@/actions/articles";
import type { ArticleWithFeed } from "@/components/articles/ArticleList";

const DEBOUNCE_MS = 300;

interface UseArticleSearch {
  query: string;
  results: ArticleWithFeed[] | null;
  isSearching: boolean;
  error: string | null;
  onChange: (query: string) => void;
}

/**
 * Debounced full-text search against the searchArticles server action.
 * Returns results=null when the query is empty so callers can fall back
 * to the unfiltered list.
 */
export function useArticleSearch(): UseArticleSearch {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleWithFeed[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChange(next: string) {
    setQuery(next);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!next.trim()) {
      setResults(null);
      setError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    timerRef.current = setTimeout(async () => {
      try {
        const r = await searchArticles(next);
        setResults(r);
        setError(null);
      } catch (e) {
        setResults(null);
        setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { query, results, isSearching, error, onChange };
}
