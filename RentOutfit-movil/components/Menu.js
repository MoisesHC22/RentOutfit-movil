import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient
import { AuthContext } from '../context/AuthContext'; // Importar el contexto de autenticación

// Menú lateral con diseño mejorado y fondo degradado
export default function SideMenu({ closeMenu }) {
  const navigation = useNavigation(); // Obtener la funcionalidad de navegación
  const { user } = useContext(AuthContext); // Obtener el estado de autenticación

  return (
    <LinearGradient
      colors={['#0180CB', '#FFFFFF']} // Configura el degradado de azul a blanco
      style={styles.menuContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Botón para cerrar el menú */}
      <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
        <Ionicons name="close" size={32} color="000000" />
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>

      {/* Botón Inicio */}
      <TouchableOpacity style={styles.menuItem} onPress={() => {
        closeMenu();
        navigation.navigate('Home'); // Navegar a la pantalla de inicio
      }}>
        <Ionicons name="home" size={24} color="#000000" />
        <Text style={styles.menuText}>Inicio</Text>
      </TouchableOpacity>

      {/* Botón Carrito */}
      <TouchableOpacity style={styles.menuItem} onPress={() => {
        closeMenu();
        if (user) {
          // Si el usuario está autenticado, navegar al carrito
          navigation.navigate('MainStack', {
            screen: 'ShoppingCart',
          });
        } else {
          // Si no está autenticado, navegar a la pantalla de inicio de sesión
          navigation.navigate('AuthStack', { screen: 'Login' });
        }
      }}>
        <Ionicons name="cart" size={24} color="#000000" />
        <Text style={styles.menuText}>Carrito</Text>
      </TouchableOpacity>

      {/* Otros botones... */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    paddingTop: 50,
    zIndex: 10, // Asegura que el menú esté encima de otros componentes
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // Texto blanco
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff', // Texto blanco
  },
});
