import React, { useEffect } from 'react';
import { View, Text, Alert,StyleSheet } from 'react-native';

const CheckoutSuccessScreen = ({ route, navigation }) => {
  const { preferenceId } = route.params || {};

  useEffect(() => {
    if (preferenceId) {
      registrarPagoExitoso(preferenceId);
    }
  }, [preferenceId]);

  const registrarPagoExitoso = async (preferenceId) => {
    try {
      await fetch('https://api.example.com/pagos/exitosos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferenceId }),
      });
      Alert.alert('Éxito', 'El pago ha sido registrado exitosamente.');
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      Alert.alert('Error', 'Hubo un problema al registrar el pago.');
    }
  };

  return (
    <View>
      <Text>¡Pago exitoso!</Text>
    </View>
  );
};

export default CheckoutSuccessScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
