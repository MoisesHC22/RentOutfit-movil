import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API


// Función para obtener los establecimientos cercanos
export const obtenerEstablecimientosCercanos = async (estado, municipio) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/EstablecimientosCercanos`, {
      estado: estado,
      municipio: municipio,
    });
    return response.data; // Retorna los datos de los establecimientos
  } catch (error) {
    console.error('Error al obtener los establecimientos cercanos', error);
    throw error; // Lanza el error para manejarlo en otro lado
  }
};