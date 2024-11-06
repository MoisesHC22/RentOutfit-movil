import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import styles, { GradientBackground } from '../../assets/styles/SignInStyle';
import { AuthContext } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('ShoppingCart');
    } catch (error) {
      setModalVisible(true); // Mostrar el modal si hay un error
      setTimeout(() => {
        setModalVisible(false); // Ocultar el modal después de 3 segundos
      }, 1000);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
          <Text style={styles.title}>¡Bienvenido!</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={24} color="#000000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#000000"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={24} color="#000000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#000000"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#000000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          {/* Enlace para recuperar contraseña */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Recover')}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        {/* Modal personalizado */}
        <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Error</Text>
            <Text style={{ fontSize: 16 }}>Usuario o contraseña incorrectos.</Text>
          </View>
        </Modal>
      </View>
    </GradientBackground>
  );
}
