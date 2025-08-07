import { useState, useEffect } from 'react';
import {
  addRecentlyAccessed,
  getRecentlyAccessed,
  clearRecentlyAccessed,
  type RecentlyAccessedItem
} from '@/utils/recent-access-tracker';
import type { Material2, PastQuestion } from '@/types';

export function useRecentlyAccessed() {
  const [recentItems, setRecentItems] = useState<RecentlyAccessedItem[]>([]);

  useEffect(() => {
    // Load items on mount
    setRecentItems(getRecentlyAccessed());
  }, []);

  const trackMaterialAccess = (material: Material2) => {
    const item = {
      id: material.id,
      title: material.title,
      type: 'material' as const,
      courseCode: material.course.code,
      courseTitle: material.course.title,
      fileUrl: material.fileUrl,
    };

    addRecentlyAccessed(item);
    setRecentItems(getRecentlyAccessed());
  };

  const trackPastQuestionAccess = (pastQuestion: PastQuestion & { course: { code: string; title: string } }) => {
    const item = {
      id: pastQuestion.id,
      title: pastQuestion.title,
      type: 'pastQuestion' as const,
      courseCode: pastQuestion.course.code,
      courseTitle: pastQuestion.course.title,
      fileUrl: pastQuestion.fileUrl,
      year: pastQuestion.year,
    };

    addRecentlyAccessed(item);
    setRecentItems(getRecentlyAccessed());
  };

  const clearAll = () => {
    clearRecentlyAccessed();
    setRecentItems([]);
  };

  const refreshItems = () => {
    setRecentItems(getRecentlyAccessed());
  };

  return {
    recentItems,
    trackMaterialAccess,
    trackPastQuestionAccess,
    clearAll,
    refreshItems,
  };
}
