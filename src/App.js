import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import UserList from './pages/UserList/UserList';
import CreateNaturalArea from './pages/CreateNaturalArea/CreateNaturalArea';
import PrivateRoute from './routes/PrivateRoute';
import CreateSpecies from './pages/CreateSpecies/CreateSpecies';
import CreateConservationActivity from './pages/CreateConservationActivity/CreateConservationActivity';
import Dashboard from './pages/Dashboard/Dashboard';
import AreaDetail from './pages/AreaDetail/AreaDetail';
import Posts from './pages/Posts/Posts';
import AuthSplit from './components/AuthSplit/AuthSplit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthSplit />} />
          <Route path="/registro" element={<AuthSplit />} />
          <Route
            path="/crear-area"
            element={
              <PrivateRoute>
                <CreateNaturalArea />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-list"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/crear-especie" 
            element={
              <PrivateRoute>
                <CreateSpecies />
              </PrivateRoute>
            }
          />
           <Route
            path="/crear-actividad"
            element={
              <PrivateRoute>
                <CreateConservationActivity />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/posts"
            element={
              <Posts />
            } 
          />
          <Route 
            path="/area/:id" 
            element={
            <AreaDetail />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
