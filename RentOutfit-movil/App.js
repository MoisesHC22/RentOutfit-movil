import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import * as Notifications from 'expo-notifications';
import { obtenerUbicacion } from './Services/Location/locateService';

// Define a navigation reference for navigating from notifications
import { navigationRef } from './navigation/RootNavigation'; // Make sure you create and export `navigationRef` in RootNavigation.js

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const [locationGranted, setLocationGranted] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const location = await obtenerUbicacion();
        setLocationGranted(true);
      } catch (error) {
        Alert.alert(
          'Permiso de Ubicación Requerido',
          'La aplicación necesita acceso a la ubicación para funcionar.',
          [{ text: 'Reintentar', onPress: requestLocation }]
        );
      }
    };

    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Permisos de notificación concedidos');
        
        // Schedule the notification to repeat every 30 minutes
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Revisa los nuevos trajes 🎉",
            body: "¡Tenemos nuevos trajes que podrían interesarte!",
            data: { screen: 'VestimentasScreen' },
          },
          trigger: { seconds: 100, repeats: true },
        });
      }
    };

    requestLocation();
    if (locationGranted) {
      requestPermissions();
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        navigationRef.current?.navigate(screen);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
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
