import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles, { GradientBackground } from '../../assets/styles/SignInStyle';
import { StatusBar } from 'expo-status-bar';
import { handlerecoverPassword } from '../../Services/loginService';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

export default function RecoverPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Estado para el mensaje del modal

  const handlePasswordReset = async () => {
    try {
      await handlerecoverPassword(email); // Asegúrate de llamar a la función correcta aquí
      setModalMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Login'); // Redirige al usuario al login después de cerrar el modal
      }, 3000);
    } catch (error) {
      setModalMessage('Revisa el correo introducido o inténtalo más tarde.'); // Mensaje de error
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
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
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={24} color="#000000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#000000"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handlePasswordReset}
          >
            <Text style={styles.loginButtonText}>Enviar enlace de recuperación</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de confirmación */}
        <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {modalMessage.includes('enlace') ? 'Correo enviado' : 'Verificar'} {/* Condición para el título */}
            </Text>
            <Text style={{ fontSize: 16 }}>{modalMessage}</Text>
          </View>
        </Modal>
      </View>
    </GradientBackground>
  );
}
