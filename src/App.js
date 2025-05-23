import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import Dashboard from './pages/Dashboard';
import TestApi from './pages/TestApi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/api-test" element={<TestApi />} />
            <Route path="/login" element={<Login login={login} isAuthenticated={isAuthenticated} />} />
            <Route path="/register" element={<Register isAuthenticated={isAuthenticated} />} />
            <Route path="/post/:id" element={<PostDetail user={user} isAuthenticated={isAuthenticated} />} />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-post/:id" 
              element={
                <ProtectedRoute>
                  <EditPost user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
