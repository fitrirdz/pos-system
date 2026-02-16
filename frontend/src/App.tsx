import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import Login from './pages/login';
import ProtectedRoute from './components/protected-routes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<Login />} />

          {/* Protected Route */}
          <Route
            path='/pos'
            element={
              <ProtectedRoute>
                <h1>POS Dashboard</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
