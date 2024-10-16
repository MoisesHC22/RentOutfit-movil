import React, { useState }  from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { validateEmail } from '../../components/Validaciones/validateEmail'; // Importar la función de validación
import styles, { GradientBackground } from '../../assets/styles/SignInStyle'; // Importar los estilos desde la nueva ubicación


// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(''); // Estado para el correo electrónico

  return (
    <GradientBackground> 
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/LogoSF.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.title}>Bienvenido!!!</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={24} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#000000"
            onChangeText={setEmail} // Actualizar el estado del correo electrónico
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={24} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#000000"
            secureTextEntry
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.forgotPassword}>No tengo cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            if (validateEmail(email)) {
              // Lógica para crear la cuenta
              alert('Cuenta creada exitosamente');
            }
          }}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
    </GradientBackground>
  );
}


