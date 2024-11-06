import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext'; // Importar el contexto de autenticación
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthStack from '../screens/Auth/AuthStack'; // Stack de autenticación
import MainStack from './MainStack'; // Pantallas principales de la app
import TermsAndConditionsScreen from '../screens/Legal/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/Legal/PrivacyPolicyScreen';
import RecoverPasswordScreenScreen from '../screens/Auth/RecoverScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado

  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      
      {/* Mostrar siempre el MainStack */}
      <Stack.Screen name="MainStack" component={MainStack} />

       {/* Agregar las pantallas de Términos y Política de Privacidad */}
       <Stack.Screen name="Terms" component={TermsAndConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Recover" component={RecoverPasswordScreenScreen} />

      {/* Mostrar AuthStack solo si el usuario no está autenticado */}
      {!user && (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
