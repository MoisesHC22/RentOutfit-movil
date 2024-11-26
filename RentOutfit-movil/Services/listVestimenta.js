import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API

export const obtenerVestimentas = async (estado, municipio, pagina, categoria = 0, filtro = '') => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/MostrarVestimentas`, {
      estado,
      municipio,
      pagina,
      categoria,
      filtro, // Incluye el filtro en la solicitud
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las vestimentas:', error);
    throw error;
  }
};