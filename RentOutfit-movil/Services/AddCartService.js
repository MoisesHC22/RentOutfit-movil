import axios from 'axios';

const API_URL = 'https://rentoutfit-apis.onrender.com/Cliente/ModificarCarrito';

export const agregarAlCarrito = async (itemCarrito) => {
  try {
    const response = await axios.post(API_URL, itemCarrito, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    throw new Error('No se pudo completar la solicitud al servidor.');
  }
};
