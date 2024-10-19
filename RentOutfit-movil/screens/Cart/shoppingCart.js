import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; 

const ShoppingCartScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext); // Obtener el estado del usuario y la función de logout

  // Si el usuario no está logueado, mostrar un mensaje diferente o redirigir a la pantalla de inicio de sesión
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Por favor, inicia sesión para ver tu carrito.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userEmail = user.email || 'usuario'; // Asegúrate de que user.email exista

  return (
    <View style={styles.container}>
      {/* Mostrar el nombre del usuario */}
      <Text style={styles.title}>¡Bienvenido a tu carrito, {userEmail}!</Text>
      
      {/* Aquí podrías agregar la lista de productos o detalles del carrito */}
      <Text style={styles.text}>Aquí están los artículos de tu carrito.</Text>

      {/* Opción para regresar al menú */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')} // Navegar al menú principal
      >
        <Text style={styles.buttonText}>Regresar al Menú</Text>
      </TouchableOpacity>

      {/* Opción para cerrar sesión */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]}
        onPress={() => {
          logout(); // Llamar a la función de logout
          navigation.navigate('Home'); // Redirigir al Menu después de cerrar sesión
        }}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginText: {
    fontSize: 18,
    color: 'blue', 
    marginTop: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#f44336', // Color rojo para el botón de cerrar sesión
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ShoppingCartScreen;
