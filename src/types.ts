export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  fontFamily: string;
  fontSize: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'nord' | 'dracula' | 'monokai' | 'solarized';
  defaultFontFamily: string;
  defaultFontSize: string;
  notifications: boolean;
}

export type SaveStatus = 'saved' | 'saving' | 'error';