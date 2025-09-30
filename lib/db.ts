import localforage from 'localforage';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  photo?: string;
  quote?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const diaryStore = localforage.createInstance({
  name: 'MiDiario',
  storeName: 'entries'
});

export async function saveEntry(entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
  const id = Date.now().toString();
  const newEntry: DiaryEntry = { ...entry, id };
  await diaryStore.setItem(id, newEntry);
  return newEntry;
}

export async function getEntries(): Promise<DiaryEntry[]> {
  const entries: DiaryEntry[] = [];
  await diaryStore.iterate((value: DiaryEntry) => {
    entries.push(value);
  });
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function deleteEntry(id: string): Promise<void> {
  await diaryStore.removeItem(id);
}

export async function getEntry(id: string): Promise<DiaryEntry | null> {
  return await diaryStore.getItem(id);
}