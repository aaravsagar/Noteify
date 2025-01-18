import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, Trash } from 'lucide-react';
import { useStore } from '../store';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note;
  onSave: () => void;
  onDelete: () => void;
}

const fontFamilies = [
  'sans-serif',
  'serif',
  'monospace',
  'Arial',
  'Times New Roman',
  'Courier New',
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px'];

export function NoteEditor({ note, onSave, onDelete }: NoteEditorProps) {
  const { updateNote, saveStatus, setSaveStatus } = useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timeoutRef = useRef<number>();

  const handleChange = (field: keyof Note, value: string) => {
    setSaveStatus('saving');
    updateNote(note.id, {
      [field]: value,
      updatedAt: new Date().toISOString(),
    });

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onSave();
      setSaveStatus('saved');
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-4">
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Note</h3>
            <p className="mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete();
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <input
          type="text"
          value={note.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-2xl font-bold bg-transparent border-none outline-none flex-grow"
          placeholder="Note title..."
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
          </span>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
            title="Delete note"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-theme pb-2">
        <select
          value={note.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="border border-theme rounded px-2 py-1 bg-[var(--bg-primary)]"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <select
          value={note.fontSize}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          className="border border-theme rounded px-2 py-1 bg-[var(--bg-primary)]"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          onClick={() => formatText('bold')}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Bold"
        >
          <Bold size={20} />
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Italic"
        >
          <Italic size={20} />
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Underline"
        >
          <Underline size={20} />
        </button>
      </div>

      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: note.content }}
        onInput={(e) => handleChange('content', e.currentTarget.innerHTML)}
        className="min-h-[300px] p-4 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg-primary)]"
        style={{
          fontFamily: note.fontFamily,
          fontSize: note.fontSize,
        }}
      />
    </div>
  );
}