import axios from 'axios';

const API_URL = 'http://moiseshc-001-site1.ktempurl.com/Cliente/MostrarVestimentas';

export const obtenerVestimentas = async (estado, municipio, pagina) => {
  try {
    const response = await axios.post(API_URL, {
      estado,
      municipio,
      pagina,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las vestimentas:', error);
    throw error;
  }
};