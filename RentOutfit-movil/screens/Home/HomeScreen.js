import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenericScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola, soy el menu</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Un fondo gris claro opcional
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Un color gris oscuro para el texto
  },
});

export default GenericScreen;
