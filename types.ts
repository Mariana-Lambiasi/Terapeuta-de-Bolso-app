export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  isLoading?: boolean;
}

export interface MoodEntry {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  timestamp: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: 'breathing' | 'meditation';
  duration: string;
  // For breathing exercises
  timings?: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2?: number;
  };
   // For meditation exercises
  steps?: string[];
}