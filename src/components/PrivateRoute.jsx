import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function PrivateRoute() {
  const { user } = useAuth();

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}