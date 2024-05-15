import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
          <Route path='/' element={<PrivateRoute component={Dashboard} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
