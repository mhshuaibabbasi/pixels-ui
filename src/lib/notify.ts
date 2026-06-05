/** Helpers for the PIXEL notification system. */

/** Extracts a notification array from the various API response shapes. */
export function extractNotifications(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data?.rows)) return res.data.rows;
  if (Array.isArray(res.data?.data?.rows)) return res.data.data.rows;
  return [];
}

/** "2h ago" style relative time from a SQL datetime string. */
export function timeAgo(value: string | Date): string {
  if (!value) return "";
  const then = new Date(typeof value === "string" ? value.replace(" ", "T") : value).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return new Date(then).toLocaleDateString();
}

/** Notifies the bell (and any listener) to re-fetch immediately after an action. */
export function refreshNotifications(): void {
  window.dispatchEvent(new CustomEvent("refreshNotifications"));
}
