import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ProtectedRoute from './components/protected-routes';
import MainLayout from './layouts/main-layout';
import Dashboard from './pages/dashboard';
import NewTransaction from './pages/new-transaction';
import TransactionHistory from './pages/transaction-history';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/transactions' element={<TransactionHistory />} />
          <Route path='/transactions/new' element={<NewTransaction />} />
        </Route>
      </Route>
    </Routes>
  );
}
