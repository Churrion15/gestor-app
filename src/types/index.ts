export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  secondaryText: string;
  accent: string;
}