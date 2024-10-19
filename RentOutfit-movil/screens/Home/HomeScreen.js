import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext); 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a la aplicación!</Text>

      {/* Si no está logueado, mostrar la opción para loguearse */}
      {!user ? (
        <TouchableOpacity onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>
          <Text>Iniciar sesión</Text>
        </TouchableOpacity>
      ) : (
        // Si está logueado, mostrar la opción de ir al perfil o cerrar sesión
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
  },
});

export default HomeScreen;
