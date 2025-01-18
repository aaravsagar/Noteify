import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar, Check } from 'lucide-react';
import { useStore } from '../store';
import { Todo } from '../types';

export function TodoList() {
  const { todos, addTodo, updateTodo, settings } = useStore(); // Access settings from the store
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTodoTitle,
      completed: false,
      dueDate: selectedDate || null,
      createdAt: new Date().toISOString(),
    };

    addTodo(newTodo);
    setNewTodoTitle('');
    setSelectedDate('');

    // Schedule notification if enabled in settings
    if (settings.notifications && selectedDate && Notification.permission === 'granted') {
      const notificationTime = new Date(selectedDate).getTime();
      const now = new Date().getTime();

      setTimeout(() => {
        const todo = todos.find((t) => t.id === newTodo.id);
        if (todo && !todo.completed) {
          new Notification('Todo Reminder', {
            body: `Is "${todo.title}" completed?`,
          });
        }
      }, Math.max(0, notificationTime - now));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow p-2 border rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button
          onClick={handleAddTodo}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow animate-fade-in"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                className={`p-1 rounded-full border ${
                  todo.completed ? 'bg-green-500 text-white' : 'text-gray-400'
                }`}
              >
                <Check size={16} />
              </button>
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.title}
              </span>
            </div>
            {todo.dueDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                {format(new Date(todo.dueDate), 'PPp')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
