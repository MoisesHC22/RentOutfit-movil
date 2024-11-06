import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API


// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    console.log(email, password);
    const response = await axios.post(`${API_URL}/Cliente/IniciarSesion`, {
      "email":email,
      "contrasena":password
    });
    return response.data;
  } catch (error) {
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
