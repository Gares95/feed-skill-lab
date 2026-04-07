"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createFolder(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Folder name cannot be empty");
  const count = await prisma.folder.count();
  const folder = await prisma.folder.create({
    data: { name: trimmed, position: count },
  });
  revalidatePath("/");
  return folder;
}

export async function renameFolder(folderId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Folder name cannot be empty");
  await prisma.folder.update({
    where: { id: folderId },
    data: { name: trimmed },
  });
  revalidatePath("/");
}

export async function deleteFolder(folderId: string) {
  // Feeds inside become uncategorized (folderId set to null via SetNull).
  await prisma.folder.delete({ where: { id: folderId } });
  revalidatePath("/");
}

export async function moveFeedToFolder(
  feedId: string,
  folderId: string | null,
) {
  await prisma.feed.update({
    where: { id: feedId },
    data: { folderId },
  });
  revalidatePath("/");
}
