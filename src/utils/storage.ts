import { GameDraft, Language } from '../types';

const DRAFTS_STORAGE_KEY = 'find_imposter_drafts_v1';

export function clearAllDrafts(): void {
  try {
    localStorage.removeItem(DRAFTS_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear drafts:', err);
  }
}

export function getSavedDrafts(): GameDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: GameDraft[] = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.updatedAt - a.updatedAt)
      : [];
  } catch (err) {
    console.error('Failed to load drafts:', err);
    return [];
  }
}

export function saveGameDraft(draft: GameDraft): void {
  try {
    const existing = getSavedDrafts();
    const filtered = existing.filter(d => d.id !== draft.id);
    const updatedDraft: GameDraft = {
      ...draft,
      updatedAt: Date.now(),
    };
    const newDrafts = [updatedDraft, ...filtered].slice(0, 10); // keep last 10
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(newDrafts));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

export function removeGameDraft(id: string): void {
  try {
    const existing = getSavedDrafts();
    const filtered = existing.filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete draft:', err);
  }
}

export function formatTimeAgo(timestamp: number, lang: Language = 'en'): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);

  if (lang === 'bn') {
    if (minutes < 1) return 'এইমাত্র';
    if (minutes === 1) return '১ মিনিট আগে';
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '১ ঘণ্টা আগে';
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '১ দিন আগে' : `${days} দিন আগে`;
  }

  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hr ago';
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
