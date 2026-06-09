// Simple validators
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
};
