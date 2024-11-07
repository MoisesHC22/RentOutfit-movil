// en validatePassword.js
export const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasTwoNumbers = /\d.*\d/.test(password);
    const minLength = password.length >= 8;
  
    return hasUpperCase && hasTwoNumbers && minLength;
  };
  