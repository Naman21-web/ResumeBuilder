import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {

  const {user} = useSelector(state => state.auth);

  console.log(user);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const logos = [];
  logos.push("/brands/google-logo.png");
  logos.push("/brands/amazon-logo.png");
  logos.push("/brands/amazon-logo.png");
  logos.push("/brands/amazon-logo.png");
  logos.push("/brands/amazon-logo.png");

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-100 blur-3xl sm:h-[500px] sm:w-[500px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <img src="/logo.svg" alt="logo" className="h-9 w-auto" />
          ai
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <a href="#" className="hover:text-green-600">Home</a>
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#testimonials" className="hover:text-green-600">Testimonials</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/app?state=register"
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-500" hidden={user}
          >
            Get started
          </Link>
          <Link
            to="/app?state=login"
            className="text-sm text-gray-600 hover:text-green-600" hidden={user}
          >
            Login
          </Link>
          <Link to='/app' className="hidden md:block px-8 py-2 bg=green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white" hidden={!user}>
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mx-6 rounded-xl border bg-white p-4 shadow md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-green-600">Home</a>
            <a href="#features" className="hover:text-green-600">Features</a>
            <a href="#testimonials" className="hover:text-green-600">Testimonials</a>
            <a href="#contact" className="hover:text-green-600">Contact</a>

            <Link
              to="/app?state=register"
              className="mt-2 rounded-full bg-green-600 px-4 py-2 text-center font-semibold text-white"
            >
              Get started
            </Link>
            <Link
              to="/app?state=login"
              className="text-center text-gray-600"
            >
              Login
            </Link>
          </nav>
        </div>
      )}

      {/* ================= HERO ================= */}
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
        {/* Social proof */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/32?img=${i}`}
                className="h-8 w-8 rounded-full border border-white"
                alt=""
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ⭐⭐⭐⭐⭐ Used by 10,000+ users
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Land your dream job with{" "}
          <span className="text-green-600">AI Powered</span> Resume.
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">
          Create professional resumes in minutes using our AI-powered resume builder. Tailor-made for your dream job!
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to='/app' className="w-full rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-500 sm:w-auto">
            Get started →
          </Link>
          <button className="w-full rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 sm:w-auto">
            Try demo
          </button>
        </div>
        <p className="py-6 text-slate-600 mt-14">Trusted by leading brands, including</p>
        <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4" id="logo-container">
            {logos.map((logo, index) => <img key={index} src={logo} alt="brand-logo" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"/>)}
        </div>
      </div>
    </section>
  );
};

export default Hero;
