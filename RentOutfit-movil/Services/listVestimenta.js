import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API

export const obtenerVestimentas = async (estado, municipio, pagina, categoria = 0) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/MostrarVestimentas`, {
      estado,
      municipio,
      pagina,
      categoria,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las vestimentas:', error);
    throw error;
  }
};