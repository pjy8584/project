// 📄 src/types/watch-record.ts
export interface WatchRecord {
    title: string;
    date: Date | null;
    type: 'video' | 'music' | 'channel';
    category?: string;
  }