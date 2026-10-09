export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

// Egyptian mobile numbers, e.g. 01012345678
export const isValidPhone = (value) => /^01[0125][0-9]{8}$/.test(value);

export function getPasswordError(password) {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return "Password must include numbers and symbols";
  }
  return "";
}

// Returns a score from 0 to 4
export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

// Returns one message for every invalid address field
export function validateAddress(values, requireName = false) {
  const errors = {};
  if (requireName && values.name.trim().length < 2) errors.name = "Enter a name for this address";
  if (values.city.trim().length < 2) errors.city = "Enter your city";
  if (values.details.trim().length < 5) errors.details = "Enter your street address";
  if (!isValidPhone(values.phone)) errors.phone = "Enter a valid Egyptian phone number";
  return errors;
}
