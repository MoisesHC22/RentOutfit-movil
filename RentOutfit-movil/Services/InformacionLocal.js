import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // Ajusta tu URL base

export const obtenerInformacionEstablecimiento = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/Cliente/InformacionEstablecimiento`, 
      id, // Enviar solo el ID directamente, no como objeto
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error en la llamada a la API:', error.response?.data || error.message);
    throw error;
  }
};
