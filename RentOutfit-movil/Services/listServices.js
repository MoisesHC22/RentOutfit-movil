import axios from 'axios';

const API_URL = 'http://moiseshc-001-site1.ktempurl.com'; // URL base de tu API

// Función para obtener géneros
export const listGeneros = async () => {
  try {
    const response = await axios.post(`${API_URL}/Listas/ObtenerGeneros`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    throw error;
  }
};

// Función para obtener estados
export const listEstados = async () => {
  try {
    const response = await axios.post(`${API_URL}/Listas/ObtenerEstados`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estados:', error);
    throw error;
  }
};

// Función para obtener municipios
export const listMunicipios = async (estadoId) => {
    try {
      const response = await axios.post(`${API_URL}/Listas/ObtenerMunicipios`, estadoId, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener municipios:', error);
      throw error;
    }
  };
  
