import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaEnvelope, FaFacebook, FaGoogle, FaShieldAlt, FaTruck } from "react-icons/fa";
import illustration from "../assets/login-illustration.jpg";
import { inputClass, primaryButtonClass } from "../components/formStyles.js";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { isValidEmail } from "../utils/validation.js";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const notice = location.state?.registered
    ? "Your account was created. Please sign in."
    : location.state?.passwordReset
    ? "Your password was changed. Please sign in."
    : "";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      await login(form, remember);
      navigate("/");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2">
      <div className="text-center">
        <img src={illustration} alt="Shopping cart full of fresh groceries" className="mx-auto w-full max-w-md rounded-2xl" />
        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h2>
        <p className="mt-3 text-gray-600">
          Join thousands of happy customers who trust FreshCart for their daily grocery needs
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><FaTruck className="text-green-600" /> Free Delivery</span>
          <span className="flex items-center gap-1.5"><FaShieldAlt className="text-green-600" /> Secure Payment</span>
          <span className="flex items-center gap-1.5"><FaClock className="text-green-600" /> 24/7 Support</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-green-600">
          Fresh<span className="text-gray-800">Cart</span>
        </h1>
        <h2 className="mt-3 text-center text-xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          Sign in to continue your fresh shopping experience
        </p>

        <div className="mt-6 space-y-3">
          <button type="button" onClick={() => showToast("Social sign-in is not available, please use your email", "error")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm hover:border-green-600">
            <FaGoogle className="text-red-500" /> Continue with Google
          </button>
          <button type="button" onClick={() => showToast("Social sign-in is not available, please use your email", "error")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm hover:border-green-600">
            <FaFacebook className="text-blue-600" /> Continue with Facebook
          </button>
        </div>

        <p className="my-5 text-center text-xs text-gray-500">OR CONTINUE WITH EMAIL</p>

        {notice && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
        {serverError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className={`${inputClass} pl-11`} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-green-600 hover:underline">Forgot Password?</Link>
            </div>
            <PasswordInput id="password" value={form.password} onChange={handleChange} placeholder="Enter your password" withLockIcon />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me signed in
          </label>

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
          New to FreshCart?{" "}
          <Link to="/register" className="font-medium text-green-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
