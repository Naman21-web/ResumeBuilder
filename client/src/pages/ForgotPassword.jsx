import React, { useState, useRef } from 'react';
import { AlertTriangle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../configs/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const showError = (msg) => {
        setError(msg);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setError(null), 5000);
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setSuccess(null);
            navigate('/login');
        }, 3000);
    };

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            showError('Email is required');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/api/users/forgot-password', { email });
            toast.success(data.message || 'Reset link sent to your email');
            showSuccess('Check your email for the password reset link');
            setEmail('');
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err.message;
            toast.error(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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
                                aria-label="Close error dialog"
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
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
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
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
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
