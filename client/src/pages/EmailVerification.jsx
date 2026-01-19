import { AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import api from "../configs/api";

export default function EmailVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const timerRef = React.useRef(null);

  // Get email from location state (passed from login/signup)
  const email = location.state?.email;

  React.useEffect(() => {
    if (!email) {
      navigate("/login");
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [email, navigate]);

  const showError = (msg) => {
    setError(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setError(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/api/users/verify-email", {
        email,
        verificationToken: otp,
      });

      setIsSuccess(true);
      dispatch(login({ user: data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      toast.success(data.message);

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/app");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      showError(err?.response?.data?.message || err.message);
    }
  };

  const resendVerification = async () => {
    try {
      await api.post("/api/users/resend-verification", { email });
      toast.success("Verification code resent to your email");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Verification Failed
                </h3>
                <p className="mt-1 text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setError(null)}
                className="inline-flex items-center rounded-md bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-500 focus:outline-none"
                aria-label="Close error dialog"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success popup */}
      {isSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative z-10 max-w-md w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-green-100 p-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Verified Successfully!
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/logo1.svg"
            className="mx-auto h-10 w-auto"
          />

          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Verification Code
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  onChange={handleChange}
                  value={otp}
                  disabled={isLoading}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Check your email inbox for the verification code
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={resendVerification}
                  className="font-semibold text-green-600 hover:text-green-500"
                >
                  Resend
                </button>
              </p>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-green-600 hover:text-green-500"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
