
// import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { TaskForm } from './pages/TaskForm';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// const { isAuthenticated } = useApp();
// return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

const AppRoutes: React.FC = () => {
  // const { isAuthenticated } = useApp();

  return (
    <Routes>
      {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<TaskForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      {/* </Route> */}
      {/* <Route element={<PublicRoute />}>  */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      {/* </Route> */}
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
