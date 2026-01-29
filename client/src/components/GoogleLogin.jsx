import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../app/features/authSlice';
import api from '../configs/api';

export default function GoogleLoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      // Send token to backend
      const { data } = await api.post('/api/users/google', {
        token: credential
      });

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      // Dispatch login action
      dispatch(login({
        token: data.token,
        user: data.user
      }));

      toast.success('Successfully logged in with Google!');
      navigate('/app');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error?.response?.data?.message || 'Failed to login with Google');
    }
  };

  const handleGoogleError = () => {
    toast.error('Failed to login with Google');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        size="large"
        width="100%"
        theme="outline"
      />
    </GoogleOAuthProvider>
  );
}
