import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles, { GradientBackground } from '../../assets/styles/LoginStyle'; // Importar los estilos desde la nueva ubicación


export default function LoginScreen({ navigation }) { // Agregar `navigation` como prop
  return (
    <GradientBackground> 
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/LogoSF.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AuthStack', { screen: 'SignIn' })} // Navegar a la pantalla de SignIn
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })} // Navegar a la pantalla de SignUp
        >
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </GradientBackground>
  );
}


