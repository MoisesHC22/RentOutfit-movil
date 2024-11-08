import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShoppingCartScreen from '../screens/Cart/shoppingCart';
import VestimentasScreen from '../screens/VestimentasScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {user ? (
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      ) : null}
      <Stack.Screen name="VestimentasScreen" component={VestimentasScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
