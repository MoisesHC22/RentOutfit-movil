import * as Location from 'expo-location';

export const obtenerUbicacion = async () => {
  try {
    // Solicitar permisos para la ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de ubicación denegado');
    }

    // Obtener la ubicación actual
    let ubicacionActual = await Location.getCurrentPositionAsync({});

    // Usar timeout para la geocodificación inversa
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Tiempo de espera excedido al obtener el código postal')), 5000);
    });

    const reverseGeocode = Location.reverseGeocodeAsync({
      latitude: ubicacionActual.coords.latitude,
      longitude: ubicacionActual.coords.longitude,
    });

    // Resolver con un timeout para evitar esperar indefinidamente
    const result = await Promise.race([reverseGeocode, timeout]);

    // Obtener el código postal del resultado de la geocodificación
    if (result && result.length > 0) {
      const { postalCode } = result[0];
      return {
        ubicacion: ubicacionActual,
        codigoPostal: postalCode || 'Código postal no disponible',
      };
    } else {
      throw new Error('No se pudo obtener el código postal');
    }
  } catch (error) {
    console.error('Error al obtener la ubicación:', error);
    throw error;
  }
};
