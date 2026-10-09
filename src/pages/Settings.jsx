import { useState } from "react";
import { FaLock, FaSave, FaUser } from "react-icons/fa";
import AccountLayout from "../components/AccountLayout.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { inputClass } from "../components/formStyles.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { replaceToken } from "../services/api.js";
import { changePassword, updateMe } from "../services/user.js";
import { isValidEmail, isValidPhone } from "../utils/validation.js";

const emptyPasswords = { currentPassword: "", password: "", rePassword: "" };
const labelClass = "mb-1 block text-xs font-semibold text-gray-700";
const buttonClass =
  "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-60";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfile(e) {
    e.preventDefault();

    // Only the fields that changed are checked and sent
    const changes = {};
    if (profile.name.trim() !== (user.name || "")) changes.name = profile.name.trim();
    if (profile.email.trim() !== (user.email || "")) changes.email = profile.email.trim();
    if (profile.phone.trim() !== (user.phone || "")) changes.phone = profile.phone.trim();

    if (Object.keys(changes).length === 0) {
      showToast("Nothing to update");
      return;
    }

    const found = {};
    if (changes.name !== undefined && changes.name.length < 3) found.name = "Name must be at least 3 characters";
    if (changes.email !== undefined && !isValidEmail(changes.email)) found.email = "Enter a valid email address";
    if (changes.phone !== undefined && !isValidPhone(changes.phone)) found.phone = "Enter a valid Egyptian phone number";
    setProfileErrors(found);
    if (Object.keys(found).length > 0) return;

    setSavingProfile(true);
    try {
      const response = await updateMe(changes);
      updateProfile({
        name: response.user.name,
        email: response.user.email,
        phone: changes.phone ?? user.phone ?? "",
      });
      showToast("Profile updated");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePassword(e) {
    e.preventDefault();
    const found = {};
    if (!passwords.currentPassword) found.currentPassword = "Enter your current password";
    if (passwords.password.length < 6) found.password = "Password must be at least 6 characters";
    if (passwords.rePassword !== passwords.password) found.rePassword = "Passwords do not match";
    setPasswordErrors(found);
    if (Object.keys(found).length > 0) return;

    setSavingPassword(true);
    try {
      const response = await changePassword(passwords);
      replaceToken(response.token);
      setPasswords(emptyPasswords);
      showToast("Password changed");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingPassword(false);
    }
  }

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const errorText = (errors, name) => errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>;

  return (
    <AccountLayout active="settings">
      <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
      <p className="text-xs text-gray-500">Update your profile information and change your password</p>

      <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleProfile} noValidate className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600"><FaUser /></span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Profile Information</p>
              <p className="text-xs text-gray-500">Update your personal details</p>
            </div>
          </div>
          <div>
            <label htmlFor="name" className={labelClass}>Full Name</label>
            <input id="name" name="name" value={profile.name} onChange={handleProfileChange} className={inputClass} />
            {errorText(profileErrors, "name")}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} placeholder="Enter your email" className={inputClass} />
            {errorText(profileErrors, "email")}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleProfileChange} placeholder="01xxxxxxxxx" className={inputClass} />
            {errorText(profileErrors, "phone")}
          </div>
          <button type="submit" disabled={savingProfile} className={`${buttonClass} bg-green-600 hover:bg-green-700`}>
            <FaSave /> {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="bg-slate-50 p-6 text-sm">
          <p className="mb-3 font-semibold text-gray-900">Account Information</p>
          <div className="flex justify-between py-1 text-gray-500">
            <span>User ID</span>
            <span className="text-xs text-gray-700">{user.id}</span>
          </div>
          <div className="flex items-center justify-between py-1 text-gray-500">
            <span>Role</span>
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium capitalize text-green-700">{user.role}</span>
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <form onSubmit={handlePassword} noValidate className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-orange-500"><FaLock /></span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>
          <div>
            <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
            <PasswordInput id="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="Enter your current password" />
            {errorText(passwordErrors, "currentPassword")}
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>New Password</label>
            <PasswordInput id="password" value={passwords.password} onChange={handlePasswordChange} placeholder="Enter your new password" />
            <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
            {errorText(passwordErrors, "password")}
          </div>
          <div>
            <label htmlFor="rePassword" className={labelClass}>Confirm New Password</label>
            <PasswordInput id="rePassword" value={passwords.rePassword} onChange={handlePasswordChange} placeholder="Confirm your new password" />
            {errorText(passwordErrors, "rePassword")}
          </div>
          <button type="submit" disabled={savingPassword} className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}>
            <FaLock /> {savingPassword ? "Saving..." : "Change Password"}
          </button>
        </form>
      </section>
    </AccountLayout>
  );
}
