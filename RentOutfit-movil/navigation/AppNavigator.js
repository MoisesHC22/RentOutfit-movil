import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthStack from '../screens/Auth/AuthStack';
import MainStack from './MainStack';
import TermsAndConditionsScreen from '../screens/Legal/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/Legal/PrivacyPolicyScreen';
import CheckoutSuccessScreen from '../screens/Cart/CheckoutSuccessScreen';
import CheckoutFailureScreen from '../screens/Cart/CheckoutFailureScreen';
import CheckoutPendingScreen from '../screens/Cart/CheckoutPendingScreen';
import RentViewScreen from '../screens/Cart/RentViewScreen';
import RecoverPasswordScreenScreen from '../screens/Auth/RecoverScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainStack" component={MainStack} />
      <Stack.Screen name="Terms" component={TermsAndConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Recover" component={RecoverPasswordScreenScreen} />
      <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccessScreen} />
      <Stack.Screen name="CheckoutFailure" component={CheckoutFailureScreen} />
      <Stack.Screen name="CheckoutPending" component={CheckoutPendingScreen} />
      <Stack.Screen name="RentViewScreen" component={RentViewScreen} />

      {!user && <Stack.Screen name="AuthStack" component={AuthStack} />}
    </Stack.Navigator>
  );
};


export default AppNavigator;
