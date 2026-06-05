export interface NotificationMeta {
  leaveId?: number;
  userId?: number;
  userName?: string;
  salaryId?: number;
  month?: string;
  year?: number;
  type?: 'leave' | 'salary' | 'user' | 'system' | 'profile';
}

export interface ParsedNotification {
  text: string;
  meta: NotificationMeta | null;
}

const META_PREFIX = '<!--meta:';
const META_SUFFIX = '-->';

export function buildNotificationMessage(
  text: string,
  meta: NotificationMeta
): string {
  return `${text}${META_PREFIX}${JSON.stringify(meta)}${META_SUFFIX}`;
}

export function parseNotificationMessage(message: string): ParsedNotification {
  if (!message) return { text: '', meta: null };

  const metaStart = message.indexOf(META_PREFIX);
  if (metaStart === -1) {
    return { text: message, meta: null };
  }

  const jsonStart = metaStart + META_PREFIX.length;
  const jsonEnd = message.indexOf(META_SUFFIX, jsonStart);
  if (jsonEnd === -1) {
    return { text: message, meta: null };
  }

  const text = message.substring(0, metaStart).trim();
  try {
    const meta = JSON.parse(message.substring(jsonStart, jsonEnd)) as NotificationMeta;
    return { text, meta };
  } catch {
    return { text: message.substring(0, metaStart).trim(), meta: null };
  }
}

export function getNotificationRoute(meta: NotificationMeta): string | null {
  if (!meta.type) return null;

  switch (meta.type) {
    case 'leave':
      return '/dashboard/leaves';
    case 'salary':
      return '/dashboard/salary';
    case 'user':
      // If it's a user-related notification, determine if it should go to Users Management or Profile
      // For now, we'll use a specific 'profile' type if we want to go to the current user's profile
      return '/dashboard/users';
    case 'profile':
      return '/dashboard/profile';
    case 'system':
      return '/dashboard/notifications';
    default:
      return null;
  }
}

export function getNotificationNavState(meta: NotificationMeta): Record<string, any> {
  const state: Record<string, any> = {};

  if (meta.leaveId) state.leaveId = meta.leaveId;
  if (meta.userId) state.userId = meta.userId;
  if (meta.salaryId) state.salaryId = meta.salaryId;
  if (meta.month) state.month = meta.month;
  if (meta.year) state.year = meta.year;

  return state;
}
