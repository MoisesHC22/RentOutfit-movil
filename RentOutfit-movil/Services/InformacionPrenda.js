import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API

export const obtenerInformacionPrenda = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/Cliente/InformacionVestimenta`, id, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};