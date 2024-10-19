import { validateEmail } from '../components/Validaciones/validateEmail'; // Importar la validación
import { login as loginService } from './authService'; // Importar correctamente la función login

// Lógica de manejo del inicio de sesión
export const handleLogin = async (email, password, navigation, setErrorMessage) => {
  // Validación de correo electrónico
  if (!validateEmail(email)) {
    setErrorMessage('Correo electrónico inválido');
    return;
  }

  try {
    // Llamada al servicio de login
    const response = await loginService(email, password);

    // Verificar si la respuesta contiene un token
    if (response != null) {
      alert('Inicio de sesión exitoso');
      return response; // Devuelve el response en caso de éxito
    } else {
      return null; // Devuelve null si no se encuentra el usuario
    }
  } catch (error) {
    setErrorMessage('Error al iniciar sesión, por favor intenta de nuevo');
  }
};
