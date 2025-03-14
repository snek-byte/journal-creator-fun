
import React from 'react';
import { RichTextEditor } from './components/RichTextEditor';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <div className="app">
      <Toaster position="top-right" />
      <RichTextEditor />
    </div>
  );
}

export default App;
