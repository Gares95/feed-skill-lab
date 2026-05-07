"use client";

import { useState } from "react";
import Link from "next/link";
import { Newspaper, Star, RefreshCw, FolderPlus, ChevronDown, ChevronRight, Pencil, Trash2, Activity, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddFeedDialog } from "./AddFeedDialog";
import { FeedItem } from "./FeedItem";
import { OpmlActions } from "./OpmlActions";
import { groupFeedsByFolder } from "@/lib/group-feeds";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  createFolder,
  renameFolder,
  deleteFolder,
  moveFeedToFolder,
} from "@/actions/folders";

export interface FolderRef {
  id: string;
  name: string;
}

export interface FeedWithCount {
  id: string;
  title: string;
  favicon: string | null;
  unreadCount: number;
  errorCount: number;
  lastFetched: Date | null;
  refreshInterval: number | null;
  folderId: string | null;
}

interface SidebarProps {
  feeds: FeedWithCount[];
  folders: FolderRef[];
  selectedFeedId: string | null;
  totalUnread: number;
  starredCount: number;
  onSelectFeed: (feedId: string | null) => void;
  onSelectStarred: () => void;
  onDeleteFeed: (feedId: string) => void;
  onRefreshFeed: (feedId: string) => void;
  onUpdateFeed: () => void;
  onRefreshAll: () => void;
  onFeedAdded: () => void;
  isStarredView: boolean;
  isRefreshing: boolean;
}

export function Sidebar({
  feeds,
  folders,
  selectedFeedId,
  totalUnread,
  starredCount,
  onSelectFeed,
  onSelectStarred,
  onDeleteFeed,
  onRefreshFeed,
  onUpdateFeed,
  onRefreshAll,
  onFeedAdded,
  isStarredView,
  isRefreshing,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderRef | null>(null);
  const [deletingFolder, setDeletingFolder] = useState(false);

  const groups = groupFeedsByFolder(feeds, folders);

  function toggleCollapsed(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleNewFolder() {
    setNewFolderName("");
    setNewFolderOpen(true);
  }

  async function submitNewFolder(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    setCreatingFolder(true);
    try {
      await createFolder(trimmed);
      onFeedAdded();
      setNewFolderOpen(false);
      setNewFolderName("");
    } finally {
      setCreatingFolder(false);
    }
  }

  function requestDeleteFolder(folder: FolderRef) {
    setFolderToDelete(folder);
  }

  async function confirmDeleteFolder() {
    if (!folderToDelete) return;
    setDeletingFolder(true);
    try {
      await deleteFolder(folderToDelete.id);
      onFeedAdded();
      setFolderToDelete(null);
    } finally {
      setDeletingFolder(false);
    }
  }

  async function commitRename(folderId: string) {
    const trimmed = renameValue.trim();
    setRenamingId(null);
    if (!trimmed) return;
    await renameFolder(folderId, trimmed);
    onFeedAdded();
  }

  async function handleMoveFeed(feedId: string, folderId: string | null) {
    await moveFeedToFolder(feedId, folderId);
    onFeedAdded();
  }

  return (
    <nav aria-label="Feeds" className="flex h-full flex-col">
      <div className="flex h-12 items-center justify-between gap-2 px-4 pt-1">
        <h1 className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Feed</h1>
        <div className="flex items-center gap-0.5 opacity-60 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] focus-within:opacity-100 hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNewFolder}
            aria-label="New folder"
            title="New folder"
          >
            <FolderPlus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onRefreshAll}
            disabled={isRefreshing}
            aria-label="Refresh all feeds"
            title="Refresh all feeds"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              aria-hidden="true"
            />
          </Button>
          <AddFeedDialog onFeedAdded={onFeedAdded} />
          <OpmlActions onImportComplete={onFeedAdded} />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Articles */}
          <button
            onClick={() => onSelectFeed(null)}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm transition-[color,background-color,padding-left] duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[2px] before:-translate-y-1/2 before:rounded-r-sm before:bg-primary before:transition-opacity before:duration-[var(--motion-fast)] before:ease-[var(--ease-out-quint)]",
              !selectedFeedId && !isStarredView
                ? "bg-accent/40 text-foreground pl-3 before:opacity-100"
                : "pl-2 text-foreground hover:bg-accent/30 before:opacity-0"
            )}
          >
            <Newspaper className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1">All Articles</span>
            {totalUnread > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {totalUnread}
              </span>
            )}
          </button>

          {/* Starred */}
          <button
            onClick={onSelectStarred}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm transition-[color,background-color,padding-left] duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[2px] before:-translate-y-1/2 before:rounded-r-sm before:bg-primary before:transition-opacity before:duration-[var(--motion-fast)] before:ease-[var(--ease-out-quint)]",
              isStarredView
                ? "bg-accent/40 text-foreground pl-3 before:opacity-100"
                : "pl-2 text-foreground hover:bg-accent/30 before:opacity-0"
            )}
          >
            <Star className="h-4 w-4 shrink-0 text-star" />
            <span className="flex-1">Starred</span>
            {starredCount > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {starredCount}
              </span>
            )}
          </button>

          <div className="h-3" aria-hidden="true" />

          {feeds.length === 0 && folders.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No feeds yet. Click + to add one.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {groups.map((group) => {
                const folderId = group.folder?.id ?? "__uncat__";
                const isCollapsed = collapsed.has(folderId);
                const label = group.folder?.name ?? "Uncategorized";
                const isRenaming = renamingId === group.folder?.id;
                return (
                  <div key={folderId} className="flex flex-col gap-0.5">
                    <div className="group flex items-center gap-1 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => toggleCollapsed(folderId)}
                        className="flex flex-1 cursor-pointer items-center gap-1 rounded px-1 py-1 outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/60"
                        aria-expanded={!isCollapsed}
                        aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${label}`}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {isRenaming && group.folder ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(group.folder!.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename(group.folder!.id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-transparent text-xs uppercase tracking-wide outline-none"
                          />
                        ) : (
                          <span className="truncate">{label}</span>
                        )}
                      </button>
                      {group.folder && !isRenaming && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingId(group.folder!.id);
                              setRenameValue(group.folder!.name);
                            }}
                            className="hidden cursor-pointer rounded p-0.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60 group-hover:block focus-visible:block"
                            aria-label={`Rename folder ${group.folder.name}`}
                            title="Rename folder"
                          >
                            <Pencil className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteFolder(group.folder!)}
                            className="hidden cursor-pointer rounded p-0.5 outline-none hover:bg-destructive/20 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/40 group-hover:block focus-visible:block"
                            aria-label={`Delete folder ${group.folder.name}`}
                            title="Delete folder"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col gap-0.5 pl-2">
                        {group.feeds.length === 0 ? (
                          <p className="px-2 py-1 text-[11px] text-muted-foreground/70">
                            Empty
                          </p>
                        ) : (
                          group.feeds.map((feed) => (
                            <FeedItem
                              key={feed.id}
                              id={feed.id}
                              title={feed.title}
                              unreadCount={feed.unreadCount}
                              favicon={feed.favicon}
                              errorCount={feed.errorCount}
                              refreshInterval={feed.refreshInterval}
                              folderId={feed.folderId}
                              folders={folders}
                              isSelected={selectedFeedId === feed.id && !isStarredView}
                              onSelect={onSelectFeed}
                              onDelete={onDeleteFeed}
                              onRefresh={onRefreshFeed}
                              onUpdated={onUpdateFeed}
                              onMove={handleMoveFeed}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-1 px-3 py-2 opacity-50 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] focus-within:opacity-100 hover:opacity-100">
        <Link
          href="/health"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-7 w-7 text-muted-foreground hover:text-foreground",
          )}
          aria-label="Feed health dashboard"
          title="Feed health dashboard"
        >
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/stats"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-7 w-7 text-muted-foreground hover:text-foreground",
          )}
          aria-label="Reading stats"
          title="Reading stats"
        >
          <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link
          href="/settings"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "ml-auto h-7 w-7 text-muted-foreground hover:text-foreground",
          )}
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <Dialog
        open={newFolderOpen}
        onOpenChange={(next) => {
          if (creatingFolder) return;
          setNewFolderOpen(next);
          if (!next) setNewFolderName("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitNewFolder} className="flex flex-col gap-3">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              disabled={creatingFolder}
              autoFocus
              aria-label="Folder name"
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline" disabled={creatingFolder}>
                    Cancel
                  </Button>
                }
              />
              <Button type="submit" disabled={creatingFolder || !newFolderName.trim()}>
                {creatingFolder ? "Creating…" : "Create folder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={folderToDelete !== null}
        onOpenChange={(next) => {
          if (deletingFolder) return;
          if (!next) setFolderToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {folderToDelete ? `“${folderToDelete.name}”` : "folder"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Feeds inside will become uncategorized. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingFolder}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteFolder}
              disabled={deletingFolder}
            >
              {deletingFolder ? "Deleting…" : "Delete folder"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
