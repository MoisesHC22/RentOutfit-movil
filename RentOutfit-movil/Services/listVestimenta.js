import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'https://rentoutfit-apis.onrender.com'; // URL base de tu API

=======
const API_URL = 'http://moiseshc-001-site1.ktempurl.com/Cliente/MostrarVestimentas';
>>>>>>> fa842bc8df47b4851a8d134c21fa29a77b743907

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