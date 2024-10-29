import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; 

const ShoppingCartScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  // Ejemplo de productos en el carrito
  const productosEnCarrito = [
    { id: '1', nombre: 'Camisa Casual', precio: 30.00, imagen: 'https://via.placeholder.com/100' },
    { id: '2', nombre: 'Zapatos Deportivos', precio: 45.00, imagen: 'https://via.placeholder.com/100' },
    { id: '3', nombre: 'Pantalones Jeans', precio: 25.00, imagen: 'https://via.placeholder.com/100' },
  ];

  // Calcular el total del carrito
  const total = productosEnCarrito.reduce((sum, item) => sum + item.precio, 0).toFixed(2);

  if (!user) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.title}>Accede para ver tu carrito</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.loginButton}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const userEmail = user.email || 'Usuario';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>¡Hola, {userEmail}!</Text>
        <Text style={styles.subtitle}>Estos son los productos en tu carrito:</Text>

        <FlatList
          data={productosEnCarrito}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Total de la compra */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total de tu compra:</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>

        {/* Botón para regresar al menú */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Seguir comprando</Text>
        </TouchableOpacity>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={() => {
            logout();
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ShoppingCartScreen;
