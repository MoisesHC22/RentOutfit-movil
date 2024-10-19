import 'react-native-gesture-handler'; // Esto debe estar primero para asegurar el correcto funcionamiento
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // Navegador principal de la app
import { AuthProvider } from './context/AuthContext'; // Proveedor de autenticación


const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
