export type RecentlyAccessedItem = {
  id: string;
  title: string;
  type: 'material' | 'pastQuestion';
  courseCode: string;
  courseTitle: string;
  accessedAt: string;
  fileUrl?: string;
  year?: number; // For past questions
};

const STORAGE_KEY = 'amatech_recently_accessed';
const MAX_RECENT_ITEMS = 5;

export function addRecentlyAccessed(item: Omit<RecentlyAccessedItem, 'accessedAt'>) {
  try {
    const recentItems = getRecentlyAccessed();

    // Remove existing item if it exists (to avoid duplicates)
    const filteredItems = recentItems.filter(existing =>
      !(existing.id === item.id && existing.type === item.type)
    );

    // Add new item at the beginning
    const newItem: RecentlyAccessedItem = {
      ...item,
      accessedAt: new Date().toISOString(),
    };

    const updatedItems = [newItem, ...filteredItems].slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to save recently accessed item:', error);
  }
}

export function getRecentlyAccessed(): RecentlyAccessedItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored) as RecentlyAccessedItem[];

    // Sort by access time (most recent first)
    return items.sort((a, b) =>
      new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to load recently accessed items:', error);
    return [];
  }
}

export function clearRecentlyAccessed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recently accessed items:', error);
  }
}

export function getRecentlyAccessedByType(type: 'material' | 'pastQuestion'): RecentlyAccessedItem[] {
  return getRecentlyAccessed().filter(item => item.type === type);
}

export function getRecentlyAccessedLimited(
    limit: number = 3
): RecentlyAccessedItem[] {
    return getRecentlyAccessed().slice(0, limit);
}
