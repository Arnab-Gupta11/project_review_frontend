'use client';

import { apiClient } from '@/redux/apiClient/apiClient';
import { logout } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logoutUser } from '@/services/auth/auth.service';

export const protectedRoutes = ['/student', '/mentor'];
export const useLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    dispatch(apiClient.util.resetApiState());
  };

  return handleLogout;
};
