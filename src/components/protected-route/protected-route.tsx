import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import type { RootState } from '../../store';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps): React.JSX.Element => {
  const { isAuthenticated, isChecking } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isChecking) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const GuestRoute = ({ children }: ProtectedRouteProps): React.JSX.Element => {
  const { isAuthenticated, isChecking } = useSelector((state: RootState) => state.auth);

  if (isChecking) {
    return <></>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
