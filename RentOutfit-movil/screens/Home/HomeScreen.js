import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { obtenerUbicacion } from '../../Services/Location/locateService'; // Importar el servicio de ubicación

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [codigoPostal, setCodigoPostal] = useState('');

  // Función para manejar la obtención de la ubicación
  const manejarUbicacion = async () => {
    try {
      const { ubicacion, codigoPostal } = await obtenerUbicacion();
      setLocation(ubicacion);
      setCodigoPostal(codigoPostal);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  useEffect(() => {
    manejarUbicacion(); // Obtener la ubicación cuando se carga la pantalla
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a la aplicación!</Text>

      {/* Mostrar ubicación y código postal */}
      <TouchableOpacity onPress={() => {
        if (location) {
          Alert.alert(
            'Ubicación actual',
            `Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}\nCódigo Postal: ${codigoPostal}`
          );
        } else if (errorMsg) {
          Alert.alert('Error', errorMsg);
        } else {
          Alert.alert('Obteniendo ubicación', 'Espera un momento mientras obtenemos tu ubicación.');
        }
      }}>
        <Text>Ver mi ubicación y Código Postal</Text>
      </TouchableOpacity>

      {/* Si no está logueado, mostrar la opción para loguearse */}
      {!user ? (
        <TouchableOpacity onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>
          <Text>Iniciar sesión</Text>
        </TouchableOpacity>
      ) : (
        // Si está logueado, mostrar la opción de ir al carrito o cerrar sesión
        <>
          <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')}>
            <Text>Ir a mi carrito</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default HomeScreen;
