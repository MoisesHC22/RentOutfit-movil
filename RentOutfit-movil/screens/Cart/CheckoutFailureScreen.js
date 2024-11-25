import React from 'react';
import { View, Text, Alert,StyleSheet } from 'react-native';

const CheckoutFailureScreen = ({ route }) => {
  const { preferenceId } = route.params || {};

  useEffect(() => {
    if (preferenceId) {
      console.log('Pago fallido para el preferenceId:', preferenceId);
    }
  }, [preferenceId]);

  return (
    <View>
      <Text>El pago fue rechazado. Intenta nuevamente.</Text>
    </View>
  );
};

export default CheckoutFailureScreen;


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
    color: '#FF3B30',
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
  marginBottom: 10,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
secondaryButton: {
  backgroundColor: '#E0E0E0',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
secondaryButtonText: {
  color: '#333',
  fontSize: 16,
  fontWeight: 'bold',
},
});


