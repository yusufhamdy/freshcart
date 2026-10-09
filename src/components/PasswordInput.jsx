import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { inputClass } from "./formStyles.js";

export default function PasswordInput({ id, value, onChange, placeholder, withLockIcon }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {withLockIcon && (
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
      )}
      <input
        id={id}
        name={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} pr-11 ${withLockIcon ? "pl-11" : ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
