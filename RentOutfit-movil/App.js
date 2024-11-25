import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking'; // Importa Linking para deep links
import { navigationRef } from './navigation/RootNavigation';
import { obtenerUbicacion } from './Services/Location/locateService';
import { View, Text, ActivityIndicator, Alert, Linking as NativeLinking, AppState } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
 // Configura las rutas de deep linking
 const linking = {
  prefixes: ['myapp://'], // Debe coincidir con el esquema en `app.json` y `AndroidManifest.xml`
  config: {
    screens: {
      CheckoutSuccess: 'checkout-success',
      CheckoutFailure: 'checkout-failure',
      CheckoutPending: 'checkout-pending',
      MainStack: 'Home',
    },
  },
};

const App = () => {
  const [locationGranted, setLocationGranted] = useState(null);
  const appState = useRef(AppState.currentState);

 

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url; // Captura la URL completa
      console.log('Deep link recibido:', url);
      const { path, queryParams } = Linking.parse(url);
    
      if (path === 'checkout-success') {
        navigationRef.current?.navigate('CheckoutSuccess', queryParams);
      } else if (path === 'checkout-failure') {
        navigationRef.current?.navigate('CheckoutFailure', queryParams);
      } else if (path === 'checkout-pending') {
        navigationRef.current?.navigate('CheckoutPending', queryParams);
      }
    };
    
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
        try {
          const location = await obtenerUbicacion();
          setLocationGranted(true);
        } catch (error) {
          setLocationGranted(null);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const location = await obtenerUbicacion();
        setLocationGranted(true);
      } catch (error) {
        setLocationGranted(null);
        Alert.alert(
          'Permiso de Ubicación Requerido',
          'La aplicación necesita acceso a la ubicación para funcionar. Por favor, otorga permisos de ubicación en Configuración.',
          [
            { text: 'Abrir Configuración', onPress: () => NativeLinking.openSettings() },
            { text: 'Reintentar', onPress: requestLocation },
          ]
        );
      }
    };

    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Revisa los nuevos trajes 🎉',
            body: '¡Tenemos nuevos trajes que podrían interesarte!',
            data: { screen: 'VestimentasScreen' },
          },
          trigger: { seconds: 180000, repeats: true },
        });
      }
    };

    if (locationGranted === null) {
      requestLocation();
    }

    if (locationGranted) {
      requestPermissions();
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        navigationRef.current?.navigate(screen);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [locationGranted]);

  if (locationGranted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Solicitando permiso de ubicación...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
