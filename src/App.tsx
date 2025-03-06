
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Write from './pages/Write';
import Meme from './pages/Meme';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/write" element={<Write />} />
        <Route path="/meme" element={<Meme />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
