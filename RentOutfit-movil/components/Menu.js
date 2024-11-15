import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

export default function SideMenu({ closeMenu }) {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user?.token) {
      try {
        const decodedToken = jwtDecode(user.token.token);
        console.log('Token decodificado', decodedToken);
        setUserData(decodedToken);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
      colors={['#0180CB', '#FFFFFF']}
      style={styles.menuContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
        <Ionicons name="close" size={32} color="#000000" />
      </TouchableOpacity>

      <View style={styles.menuContent}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: user
                ? userData.imagen
                : 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // Imagen de incógnito
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user ? userData.nombre : 'Inicia sesión para una mejor experiencia'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            closeMenu();
            navigation.navigate('Home');
          }}
        >
          <Ionicons name="home" size={24} color="#000000" />
          <Text style={styles.menuText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            closeMenu();
            if (user) {
              navigation.navigate('MainStack', { screen: 'ShoppingCart' });
            } else {
              navigation.navigate('AuthStack', { screen: 'Login' });
            }
          }}
        >
          <Ionicons name="cart" size={24} color="#000000" />
          <Text style={styles.menuText}>Carrito</Text>
        </TouchableOpacity>
      </View>

      {user ? (
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => {
            closeMenu();
            navigation.navigate('AuthStack', { screen: 'Login' });
          }}
        >
          <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
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
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomColor: '#333',
  },
  closeText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  menuContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9534F',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5CB85C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  loginText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
