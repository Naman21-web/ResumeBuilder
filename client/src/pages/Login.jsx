import { AlertTriangle } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import api from "../configs/api";
import GoogleLogin from "../components/GoogleLogin";

export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error,setError]=React.useState(null);
    const [formdata,setFormdata]=React.useState({
        email:"",
        password:""
    })

    const query = new URLSearchParams(window.location.search);
    const urlState = query.get('state');
    const [state,setState] = React.useState(urlState || "login");
    const timerRef = React.useRef(null)
    
      const showError = (msg) => {
        setError(msg)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setError(null), 5000)
      }
    
      React.useEffect(() => {
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current)
        }
      }, [])

    const handleSubmit= async(e)=>{
        e.preventDefault();
        // showError("Invalid credentials");
        // console.log(formdata);
        try{
          const {data} = await api.post(`/api/users/${state}`,formdata);
          
          // If signup, redirect to email verification
          if(state === 'signup'){
            toast.success('Verification code sent to your email');
            navigate('/verify-email', { state: { email: formdata.email } });
          } else {
            // If login, redirect to email verification
            toast.success('Verification code sent to your email');
            navigate('/verify-email', { state: { email: formdata.email } });
          }
        }
        catch(err){
          toast(err?.response?.data?.message || err.message);
        }
    }

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormdata(prev => ({...prev, [name]:value}));
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
              <div className="flex-shrink-0 rounded-full bg-green-100 p-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
                <p className="mt-1 text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setError(null)}
                className="inline-flex items-center rounded-md bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-500 focus:outline-none"
                aria-label="Close error dialog"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/logo1.svg"
            className="mx-auto h-10 w-auto"
          />

          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
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
                  onChange={handleChange}
                  value={formdata.email}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-semibold text-green-600 hover:text-green-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  value={formdata.password}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin />
            </div>
          </div>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold text-green-600 hover:text-green-500">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
