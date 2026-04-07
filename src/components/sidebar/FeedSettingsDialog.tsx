"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateFeed } from "@/actions/feeds";

interface FeedSettingsDialogProps {
  feedId: string;
  initialTitle: string;
  initialRefreshInterval: number | null;
  initialFolderId: string | null;
  folders: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  onMove: (feedId: string, folderId: string | null) => void;
}

export function FeedSettingsDialog({
  feedId,
  initialTitle,
  initialRefreshInterval,
  initialFolderId,
  folders,
  open,
  onOpenChange,
  onSaved,
  onMove,
}: FeedSettingsDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [interval, setInterval] = useState<string>(
    initialRefreshInterval?.toString() ?? "",
  );
  const [folderId, setFolderId] = useState<string>(initialFolderId ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    let parsed: number | null = null;
    if (interval.trim()) {
      const n = Number(interval);
      if (!Number.isInteger(n) || n <= 0) {
        setError("Refresh interval must be a positive integer (minutes)");
        return;
      }
      parsed = n;
    }

    setSaving(true);
    try {
      await updateFeed(feedId, { title, refreshInterval: parsed });
      const nextFolderId = folderId || null;
      if (nextFolderId !== (initialFolderId ?? null)) {
        onMove(feedId, nextFolderId);
      }
      onSaved();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Feed settings</DialogTitle>
          <DialogDescription>
            Customize this feed&apos;s name and refresh schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="feed-title" className="text-xs text-muted-foreground">
              Name
            </label>
            <Input
              id="feed-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feed-interval"
              className="text-xs text-muted-foreground"
            >
              Refresh interval (minutes)
            </label>
            <Input
              id="feed-interval"
              type="number"
              min={1}
              placeholder="Default"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use the global default.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="feed-folder" className="text-xs text-muted-foreground">
              Folder
            </label>
            <select
              id="feed-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
            >
              <option value="">Uncategorized</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
