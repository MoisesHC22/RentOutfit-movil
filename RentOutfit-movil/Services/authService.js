import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API
const API_URL_CORREO = 'https://ro-api-soporte.onrender.com'; // URL base de tu API


// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/IniciarSesion`, {
      "email":email,
      "contrasena":password
    });
    const token = response.data.token;
    const decoded = jwtDecode(token);
      // Si la autenticación es exitosa, envía una notificación por correo
   if (response.data && response.data.token) {
     await sendLoginNotificationEmail(email,decoded.nombre);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Función para registrar usuario
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/RegistrarCliente`, formData, {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al registrar el usuario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const recoverPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/RecuperarContrasena/ObtenerToken`, { 
      "email":email 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendLoginNotificationEmail = async (email, nombre) => {
  try {
    await axios.post(`${API_URL_CORREO}/api/Email/send-email`, {
      email: email,
      nombre: nombre,
      asunto: "Se ha detectado un nuevo inicio de sesión",
      mensaje: "XD",
    });
    
  } catch (error) {
    throw error;
  }
};
