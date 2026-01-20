import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../configs/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formdata, setFormdata] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [token]);

    const showErrorMsg = (msg) => {
        setError(msg);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setError(null), 5000);
    };

    const showSuccessMsg = (msg) => {
        setSuccess(msg);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setSuccess(null);
            navigate('/login');
        }, 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata(prev => ({ ...prev, [name]: value }));
    };

    const validatePassword = () => {
        if (!formdata.password || !formdata.confirmPassword) {
            showErrorMsg('Both password fields are required');
            return false;
        }

        if (formdata.password.length < 6) {
            showErrorMsg('Password must be at least 6 characters long');
            return false;
        }

        if (formdata.password !== formdata.confirmPassword) {
            showErrorMsg('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/users/reset-password', {
                token,
                password: formdata.password,
                confirmPassword: formdata.confirmPassword
            });
            toast.success(data.message || 'Password reset successfully');
            showSuccessMsg('Password reset successfully. Redirecting to login...');
            setFormdata({ password: '', confirmPassword: '' });
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err.message || 'Failed to reset password';
            toast.error(errorMsg);
            showErrorMsg(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-lg bg-red-50 p-6 text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900">Invalid Reset Link</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            The password reset link is invalid or expired.
                        </p>
                        <button
                            onClick={() => navigate('/login?state=forgot')}
                            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            Request New Link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Error popup */}
            {error && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
                    role="alertdialog"
                    aria-modal="true"
                    onClick={() => setError(null)}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className="relative z-10 max-w-md w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 rounded-full bg-red-100 p-2 text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                                <p className="mt-1 text-sm text-gray-600">{error}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setError(null)}
                                className="inline-flex items-center rounded-md bg-red-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-500 focus:outline-none"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success popup */}
            {success && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
                    role="alertdialog"
                    aria-modal="true"
                    onClick={() => setSuccess(null)}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className="relative z-10 max-w-md w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 rounded-full bg-green-100 p-2 text-green-600">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Success</h3>
                                <p className="mt-1 text-sm text-gray-600">{success}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="/logo1.svg"
                        className="mx-auto h-10 w-auto"
                    />

                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                New Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    onChange={handleChange}
                                    value={formdata.password}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    onChange={handleChange}
                                    value={formdata.confirmPassword}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="font-semibold text-green-600 hover:text-green-500 bg-transparent border-0 cursor-pointer"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}
