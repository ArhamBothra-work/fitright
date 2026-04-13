import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cursor from './components/Cursor';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import Plans from './pages/Plans';
import Tracker from './pages/Tracker';

function App() {
  return (
    <Router>
      <Cursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/guides" element={<ProtectedRoute><Guides /></ProtectedRoute>} />
        <Route path="/guides/:id" element={<ProtectedRoute><GuideDetail /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;