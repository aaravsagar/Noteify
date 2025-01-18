import React from 'react';
import { Plus, Download, Upload, ChevronRight, Calendar } from 'lucide-react';
import JSZip from 'jszip';
import { useStore } from '../store';
import { format } from 'date-fns';
import { Note } from '../types';
import { NoteEditor } from '../components/NoteEditor';

export function Notes() {
  const { notes, addNote, deleteNote } = useStore();
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fontFamily: 'sans-serif',
      fontSize: '16px',
    };
    addNote(newNote);
    setSelectedNote(newNote);
  };

  const handleExport = async () => {
    const zip = new JSZip();
    notes.forEach((note) => {
      zip.file(`${note.title}.ntfy`, JSON.stringify(note, null, 2));
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    Object.keys(contents.files).forEach(async (filename) => {
      if (filename.endsWith('.ntfy')) {
        const content = await contents.files[filename].async('string');
        const note: Note = JSON.parse(content);
        addNote({ ...note, id: crypto.randomUUID() });
      }
    });
  };

  if (selectedNote) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedNote(null)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ChevronRight className="rotate-180" size={20} />
          <span>Back to Notes</span>
        </button>
        <div className="border rounded-lg p-4">
          <NoteEditor
            note={selectedNote}
            onSave={() => {}}
            onDelete={() => {
              deleteNote(selectedNote.id);
              setSelectedNote(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notes</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateNote}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export Notes"
          >
            <Download size={20} />
          </button>
          <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Upload size={20} />
            <input
              type="file"
              accept=".zip"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notes yet. Create one to get started!
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="w-full text-left p-4 border rounded-lg hover:shadow-md transition-shadow animate-fade-in"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{note.title || 'Untitled Note'}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2"
                     dangerouslySetInnerHTML={{ __html: note.content || 'No content' }}
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}