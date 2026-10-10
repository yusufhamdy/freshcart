import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle, FaShieldAlt, FaStar, FaTruck, FaUserPlus } from "react-icons/fa";
import { inputClass, primaryButtonClass } from "../components/formStyles.js";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { signUp } from "../services/auth.js";
import { getPasswordError, getPasswordStrength, isValidEmail, isValidPhone } from "../utils/validation.js";

const benefits = [
  { icon: FaStar, title: "Premium Quality", text: "Premium quality products sourced from trusted suppliers." },
  { icon: FaTruck, title: "Fast Delivery", text: "Same-day delivery available in most areas" },
  { icon: FaShieldAlt, title: "Secure Shopping", text: "Your data and payments are completely secure" },
];

const strengthLevels = [
  { label: "Weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-red-500" },
  { label: "Medium", color: "bg-yellow-500" },
  { label: "Medium", color: "bg-yellow-500" },
  { label: "Strong", color: "bg-green-600" },
];

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "", rePassword: "", phone: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const strength = getPasswordStrength(form.password);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address";
    const passwordError = getPasswordError(form.password);
    if (passwordError) newErrors.password = passwordError;
    if (form.rePassword !== form.password) newErrors.rePassword = "Passwords do not match";
    if (!isValidPhone(form.phone)) newErrors.phone = "Enter a valid Egyptian phone number";
    if (!agreed) newErrors.agreed = "You must agree to the Terms of Service and Privacy Policy";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      await signUp({ ...form, name: form.name.trim() });
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-14 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to <span className="text-green-600">FreshCart</span>
        </h2>
        <p className="mt-2 text-gray-600">
          Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
        </p>
        <ul className="mt-6 space-y-5">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <blockquote className="mt-8 rounded-lg border border-gray-200 p-4 text-xs italic text-gray-600">
          <p className="mb-2 flex items-center gap-2 not-italic">
            <span className="font-medium text-gray-800">Sarah Johnson</span>
            <span className="flex text-yellow-400"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></span>
          </p>
          "FreshCart has transformed my shopping experience. The quality of the products is
          outstanding, and the delivery is always on time. Highly recommend!"
        </blockquote>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-gray-800">Create Your Account</h1>
        <p className="mt-1 text-center text-sm text-gray-600">Start your fresh journey with us today</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => showToast("Social sign-in is not available, please use your email", "error")} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm hover:border-green-600">
            <FaGoogle className="text-red-500" /> Google
          </button>
          <button type="button" onClick={() => showToast("Social sign-in is not available, please use your email", "error")} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm hover:border-green-600">
            <FaFacebook className="text-blue-600" /> Facebook
          </button>
        </div>
        <p className="my-5 text-center text-xs text-gray-500">or</p>

        {serverError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-semibold text-gray-700">Name<span className="text-red-500">*</span></label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Ali" className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">Email<span className="text-red-500">*</span></label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="ali@example.com" className={inputClass} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-700">Password<span className="text-red-500">*</span></label>
            <PasswordInput id="password" value={form.password} onChange={handleChange} placeholder="create a strong password" />
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 rounded bg-gray-200">
                <div className={`h-1 rounded ${strengthLevels[strength].color}`} style={{ width: `${(strength / 4) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-500">{strengthLevels[strength].label}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters with numbers and symbols</p>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="rePassword" className="mb-1 block text-xs font-semibold text-gray-700">Confirm Password<span className="text-red-500">*</span></label>
            <PasswordInput id="rePassword" value={form.rePassword} onChange={handleChange} placeholder="confirm your password" />
            {errors.rePassword && <p className="mt-1 text-xs text-red-500">{errors.rePassword}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-gray-700">Phone Number<span className="text-red-500">*</span></label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="01012345678" className={inputClass} />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="text-green-600 hover:underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" target="_blank" className="text-green-600 hover:underline">Privacy Policy</Link> *
              </span>
            </label>
            {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
          </div>

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            <FaUserPlus /> {loading ? "Creating account..." : "Create My Account"}
          </button>
        </form>

        <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-green-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
}
