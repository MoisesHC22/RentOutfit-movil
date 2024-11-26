import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../context/AuthContext';

const CheckoutSuccessScreen = ({ route, navigation }) => {
  const { collection_id: operationId, collection_status: status } = route.params || {};
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user && user.token?.token) {
      const decodedToken = jwtDecode(user.token.token);
      setUserData(decodedToken);
    }
  }, [user]);

  useEffect(() => {
    if (operationId) {
      registrarPagoExitoso(operationId, userData.usuario);
    }
  }, [operationId, userData]);

  const registrarPagoExitoso = async (operationId, userId) => {
    try {
      const response = await fetch('https://rentoutfit-apis.onrender.com/Cliente/GuardarPago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: userId, paymentId: operationId }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'El pago ha sido registrado exitosamente.');
        setTimeout(() => {
          navigation.navigate('Home'); // Redirige al Home después de 3 segundos
        }, 3000);
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (error) {
     throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="check-circle" size={100} color="#4CAF50" style={styles.icon} />
        <Text style={styles.title}>¡Pago exitoso!</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Número de operación:</Text>
          <Text style={styles.value}>{operationId || 'No disponible'}</Text>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{status || 'Desconocido'}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CheckoutSuccessScreen;
