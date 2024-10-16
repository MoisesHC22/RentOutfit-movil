export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor ingrese un correo electrónico válido.');
      return false;
    } else {
      return true;
    }
  }