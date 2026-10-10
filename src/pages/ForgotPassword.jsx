import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaEnvelope, FaKey, FaLock, FaShieldAlt } from "react-icons/fa";
import { inputClass, primaryButtonClass } from "../components/formStyles.js";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { forgotPassword, resetPassword, verifyResetCode } from "../services/auth.js";
import { getPasswordError, isValidEmail } from "../utils/validation.js";

const stepIcons = [FaEnvelope, FaKey, FaLock];

const headings = [
  { title: "Forgot Password?", text: "No worries, we'll send you a reset code" },
  { title: "Check Your Email", text: "Enter the 6-digit code sent to" },
  { title: "Create New Password", text: "Your new password must be different from previous passwords" },
];

export default function ForgotPassword() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [passwords, setPasswords] = useState({ password: "", rePassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  // Runs an API action and shows its error message if it fails
  async function run(action) {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEmail(e) {
    e.preventDefault();
    if (!isValidEmail(email)) return setError("Enter a valid email address");
    run(async () => {
      await forgotPassword(email);
      setStep(1);
    });
  }

  function handleCode(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code");
    run(async () => {
      await verifyResetCode(code);
      setStep(2);
    });
  }

  function handleResend() {
    run(async () => {
      await forgotPassword(email);
      setMessage("A new code was sent to your email");
    });
  }

  function handleReset(e) {
    e.preventDefault();
    const passwordError = getPasswordError(passwords.password);
    if (passwordError) return setError(passwordError);
    if (passwords.password !== passwords.rePassword) return setError("Passwords do not match");
    run(async () => {
      await resetPassword(email, passwords.password);
      navigate("/login", { state: { passwordReset: true } });
    });
  }

  function handlePasswordChange(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2">
      <div className="hidden min-w-0 text-center lg:block">
        <div className="mx-auto flex h-60 max-w-md items-center justify-center rounded-2xl bg-green-50">
          <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-4xl text-green-600 shadow-lg">
            <FaLock />
          </span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">Reset Your Password</h2>
        <p className="mt-3 text-gray-600">
          Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><FaEnvelope className="text-green-600" /> Email Verification</span>
          <span className="flex items-center gap-1.5"><FaShieldAlt className="text-green-600" /> Secure Reset</span>
          <span className="flex items-center gap-1.5"><FaLock className="text-green-600" /> Encrypted</span>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-green-600">
          Fresh<span className="text-gray-800">Cart</span>
        </h1>
        <h2 className="mt-3 text-center text-xl font-bold text-gray-800">{headings[step].title}</h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          {headings[step].text} {step === 1 && email}
        </p>

        <div className="my-6 flex items-center justify-center">
          {stepIcons.map((Icon, index) => (
            <div key={index} className="flex items-center">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${index <= step ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                {index < step ? <FaCheck /> : <Icon />}
              </span>
              {index < 2 && <span className={`h-0.5 w-16 ${index < step ? "bg-green-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

        {step === 0 && (
          <form onSubmit={handleEmail} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className={`${inputClass} pl-11`} />
              </div>
            </div>
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-green-600 hover:underline">
              <FaArrowLeft className="text-xs" /> Back to Sign In
            </Link>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={handleCode} noValidate className="space-y-4">
            <div>
              <label htmlFor="code" className="mb-1 block text-xs font-semibold text-gray-700">Verification Code</label>
              <input id="code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="••••••" className={`${inputClass} text-center text-lg tracking-widest`} />
            </div>
            <p className="text-center text-xs text-gray-500">
              Didn't receive the code?{" "}
              <button type="button" onClick={handleResend} disabled={loading} className="font-semibold text-green-600 hover:underline">Resend Code</button>
            </p>
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button type="button" onClick={() => { setStep(0); setError(""); setMessage(""); }} className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:underline">
              <FaArrowLeft className="text-xs" /> Change email address
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} noValidate className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-700">New Password</label>
              <PasswordInput id="password" value={passwords.password} onChange={handlePasswordChange} placeholder="Enter new password" withLockIcon />
            </div>
            <div>
              <label htmlFor="rePassword" className="mb-1 block text-xs font-semibold text-gray-700">Confirm Password</label>
              <PasswordInput id="rePassword" value={passwords.rePassword} onChange={handlePasswordChange} placeholder="Confirm new password" withLockIcon />
            </div>
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 0 && (
          <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-green-600 hover:underline">Sign In</Link>
          </p>
        )}
      </div>
    </section>
  );
}
