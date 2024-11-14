import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from '../../assets/styles/SplashStyle';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Temporizador de 5 segundos antes de redirigir al MainStack
    const timer = setTimeout(() => {
      navigation.replace('MainStack'); // Reemplaza SplashScreen con MainStack
    }, 3000);

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Logo.jpg')} // Coloca aquí la ruta de tu logo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
