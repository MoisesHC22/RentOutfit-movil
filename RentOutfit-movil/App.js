import 'react-native-gesture-handler'; // Esto debe estar primero para asegurar el correcto funcionamiento
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // Navegador principal de la app

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
