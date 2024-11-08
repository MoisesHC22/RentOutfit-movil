import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShoppingCartScreen from '../screens/Cart/shoppingCart';
import VestimentasScreen from '../screens/VestimentasScreen';
<<<<<<< HEAD
=======
import DetallesPrenda from '../screens/DetallesPrenda'; // Importa DetallesPrenda
>>>>>>> 2c797c5 (Vista DetallesPrenda, Consumo de API InformacionVestimenta, botones nuevos.)
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
<<<<<<< HEAD
      {user ? (
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      ) : null}
=======

      {/* Permitir acceso al carrito solo si el usuario está autenticado */}
      {user ? (
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      ) : null}

      {/* Pantalla de vestimentas */}
>>>>>>> 2c797c5 (Vista DetallesPrenda, Consumo de API InformacionVestimenta, botones nuevos.)
      <Stack.Screen name="VestimentasScreen" component={VestimentasScreen} />

      {/* Nueva pantalla de detalles de la prenda */}
      <Stack.Screen name="DetallesPrenda" component={DetallesPrenda} />
    </Stack.Navigator>
  );
};

export default MainStack;
