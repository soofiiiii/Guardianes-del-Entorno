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
import UserProfile from './pages/UserProfile/UserProfile';
import MySpecies from './pages/Dashboard/MySpecies';
import EditSpecies from './pages/CreateSpecies/EditSpecies';
import EditActivity from './pages/CreateConservationActivity/EditActivity';
import EditArea from './pages/CreateNaturalArea/EditArea';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthSplit />} />
          <Route path="/registro" element={<AuthSplit />} />

          {/* Rutas protegidas (solo para usuarios autenticados) */}
          <Route
            path="/crear-area"
            element={
              <PrivateRoute>
                <CreateNaturalArea />
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
            path="/user-list"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />

          {/* Ruta pública para ver perfiles de usuario */}
          <Route path="/perfil/:userId" element={<UserProfile />} />

          {/* Rutas públicas */}
          <Route path="/posts" element={<Posts />} />
          <Route path="/area/:id" element={<AreaDetail />} />

          <Route
            path="/mis-especies"
            element={
              <PrivateRoute>
                <MySpecies />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar-especie/:speciesId"
            element={
              <PrivateRoute>
                <EditSpecies />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-species/:speciesId"
            element={
              <PrivateRoute>
                <EditSpecies />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-activity/:activityId"
            element={
              <PrivateRoute>
                <EditActivity />
              </PrivateRoute>
            }
          />

          <Route
            path="/editar-area/:areaId"
            element={
              <PrivateRoute>
                <EditArea />
              </PrivateRoute>
            }
          />



        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
