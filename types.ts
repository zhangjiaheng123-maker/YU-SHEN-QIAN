export enum FortuneLevel {
  DAIKICHI = '大吉',
  KICHI = '吉',
  CHUKICHI = '中吉',
  SHOKICHI = '小吉',
  SUEKICHI = '末吉',
  KYO = '凶',
}

export interface FortuneResponse {
  level: FortuneLevel;
  poem: string; // A short poetic verse (4 lines ideally)
  poem_explanation: string; // Meaning of the poem
  overview: string; // General luck summary
  love: string;
  work: string;
  health: string;
  money: string;
  lucky_item: string;
  lucky_color: string;
  lucky_direction: string;
}

export interface DailyHoroscopeResponse {
  score: number; // 0-100
  theme: string; // e.g., "Persistence", "Rest"
  advice: string;
}

export type AppState = 'INIT' | 'GENERATING_ASSETS' | 'IDLE' | 'SHAKING' | 'STICK_DRAWN' | 'OPENING' | 'RESULT' | 'ERROR';

export interface GeneratedAssets {
  boxImage: string | null;
  stickImage: string | null;
}