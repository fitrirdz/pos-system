import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ProtectedRoute from './components/protected-routes';
import RoleRoute from './components/role-route';
import RoleDefaultRedirect from './components/role-default-redirect';
import MainLayout from './layouts/main-layout';
import AdminDashboard from './pages/admin/dashboard';
import CashierDashboard from './pages/cashier/dashboard';
import NewTransaction from './pages/cashier/new-transaction';
import TransactionHistoryAdmin from './pages/admin/transaction-history';
import TransactionHistoryCashier from './pages/cashier/transaction-history';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path='/admin/dashboard'
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path='/admin/transactions'
            element={
              <RoleRoute allowedRoles={['ADMIN']}>
                <TransactionHistoryAdmin />
              </RoleRoute>
            }
          />

          <Route
            path='/cashier/dashboard'
            element={
              <RoleRoute allowedRoles={['CASHIER']}>
                <CashierDashboard />
              </RoleRoute>
            }
          />
          <Route
            path='/cashier/transactions'
            element={
              <RoleRoute allowedRoles={['CASHIER']}>
                <TransactionHistoryCashier />
              </RoleRoute>
            }
          />
          <Route
            path='/cashier/transactions/new'
            element={
              <RoleRoute allowedRoles={['CASHIER']}>
                <NewTransaction />
              </RoleRoute>
            }
          />

          {/* Backward-compatible routes */}
          <Route path='/dashboard' element={<RoleDefaultRedirect section='dashboard' />} />
          <Route path='/transactions' element={<RoleDefaultRedirect section='transactions' />} />
          <Route path='/transactions/new' element={<RoleDefaultRedirect section='new-transaction' />} />
        </Route>
      </Route>
    </Routes>
  );
}
