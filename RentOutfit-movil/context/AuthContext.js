import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogin as loginService } from '../Services/loginService'; // Importar tu servicio de autenticación

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario logueado
  const [loading, setLoading] = useState(true); // Estado para saber si está cargando

  useEffect(() => {
    // Cargar el usuario del almacenamiento al inicio de la app
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error cargando el usuario del almacenamiento', error);
      } finally {
        setLoading(false); // Dejar de cargar aunque haya error o éxito
      }
    };
    loadUserFromStorage();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      if (response != null) {
        const userData = { email, token: response};
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData)); // Guardar en AsyncStorage
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      throw error; // Reenviar error para que las pantallas lo manejen
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setUser(null); // Eliminar el usuario del estado
      await AsyncStorage.removeItem('user'); // Eliminar de AsyncStorage
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
