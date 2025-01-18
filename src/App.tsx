import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Notes } from './pages/Notes';
import { TodoList } from './components/TodoList';
import { Pomodoro } from './components/Pomodoro';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/notes" replace />} />
          <Route path="notes" element={<Notes />} />
          <Route path="todos" element={<TodoList />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;