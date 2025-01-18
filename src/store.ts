import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Todo, Settings, SaveStatus } from './types';

interface AppState {
  notes: Note[];
  todos: Todo[];
  settings: Settings;
  saveStatus: SaveStatus;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      notes: [],
      todos: [],
      settings: {
        theme: 'light',
        defaultFontFamily: 'sans-serif',
        defaultFontSize: '16px',
        notifications: true,
      },
      saveStatus: 'saved',
      addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updatedNote) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updatedNote } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      addTodo: (todo) =>
        set((state) => ({ todos: [...state.todos, todo] })),
      updateTodo: (id, updatedTodo) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updatedTodo } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setSaveStatus: (status) =>
        set(() => ({ saveStatus: status })),
    }),
    {
      name: 'notey-storage',
    }
  )
);