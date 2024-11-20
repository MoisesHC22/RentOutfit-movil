import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import * as Notifications from 'expo-notifications';
import { navigationRef } from './navigation/RootNavigation';
import { obtenerUbicacion } from './Services/Location/locateService';
import { View, Text, ActivityIndicator, Alert, Linking, AppState } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const [locationGranted, setLocationGranted] = useState(null);
  const appState = useRef(AppState.currentState);

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
      subscription.remove(); // Uso del patrón correcto para limpiar el listener
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
            { text: 'Abrir Configuración', onPress: () => Linking.openSettings() },
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
            title: "Revisa los nuevos trajes 🎉",
            body: "¡Tenemos nuevos trajes que podrían interesarte!",
            data: { screen: 'VestimentasScreen' }, // Pantalla a la que queremos redirigir
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

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        navigationRef.current?.navigate(screen);
      }
    });

    return () => {
      subscription.remove(); // Limpiar el listener de notificaciones
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
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
