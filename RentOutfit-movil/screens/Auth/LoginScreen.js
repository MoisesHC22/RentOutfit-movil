import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles, { GradientBackground } from '../../assets/styles/LoginStyle';

export default function LoginScreen({ navigation }) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={require('../../assets/images/LogoSF.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AuthStack', { screen: 'SignIn' })}
          >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })}
          >
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
