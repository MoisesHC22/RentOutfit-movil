import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShoppingCartScreen from '../screens/Cart/shoppingCart';
import VestimentasScreen from '../screens/VestimentasScreen';
import DetallesPrenda from '../screens/DetallesPrenda'; // Importa DetallesPrenda
import { AuthContext } from '../context/AuthContext';
import DetallesLocal from '../screens/DetallesLocal';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Permitir acceso al carrito solo si el usuario está autenticado */}
      {user ? (
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      ) : null}

      {/* Pantalla de vestimentas */}

      <Stack.Screen name="VestimentasScreen" component={VestimentasScreen} />

      {/* Nueva pantalla de detalles de la prenda */}
      <Stack.Screen name="DetallesPrenda" component={DetallesPrenda} />

      {/* Nueva pantalla de detalles del local */}
      <Stack.Screen name="DetallesLocal" component={DetallesLocal} />
    </Stack.Navigator>
  );
};

export default MainStack;
