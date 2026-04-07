export type DateRange = "all" | "today" | "week" | "month";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  all: "All time",
  today: "Today",
  week: "Past week",
  month: "Past month",
};

export function isDateRange(value: string | undefined): value is DateRange {
  return value === "all" || value === "today" || value === "week" || value === "month";
}

export function dateRangeToSince(range: DateRange): Date | undefined {
  if (range === "all") return undefined;
  const now = new Date();
  if (range === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (range === "week") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  if (range === "month") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return undefined;
}
