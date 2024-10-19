import axios from 'axios';

const API_URL = 'http://moiseshc-001-site1.ktempurl.com'; // URL base de tu API

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
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/RegistrarCliente`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user', error);
    throw error;
  }
};
