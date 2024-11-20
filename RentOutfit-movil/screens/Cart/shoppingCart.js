import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listCart } from '../../Services/listServices';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { obtenerInformacionPrenda } from '../../Services/InformacionPrenda';
import styles from '../../assets/styles/CartStyle'


export default function CarritoScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarrito = async () => {
      if (!user) {
        Alert.alert(
          'Inicia sesión',
          'Debes iniciar sesión para ver tu carrito.',
          [
            {
              text: 'Ir a Login',
              onPress: () => navigation.navigate('AuthStack', { screen: 'Login' }),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
            },
          ]
        );
        return;
      }
  
      try {
        // Decodifica el token
        const decodedToken = jwtDecode(user.token.token);
        const usuarioID = parseInt(decodedToken.usuario, 10); // Convierte `usuario` a número
        setUserData(decodedToken);
  
        console.log("Decoded usuarioID:", usuarioID); // Confirma que el usuarioID no es `undefined`
  
        // Ahora llama al carrito con el usuarioID
        const data = await listCart(usuarioID);
        const detailedInfo = await Promise.all(
          data.map(async (item) => {
            const prendaData = await obtenerInformacionPrenda(item.vestimentaID);
            return { ...item, ...prendaData };
          })
        );
        setCarrito(detailedInfo);
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        Alert.alert('Error', 'No se pudo cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCarrito();
  }, [user]);
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagen1 }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.nombrePrenda}</Text>
        <Text style={styles.itemText}>Cantidad: {item.stock}</Text>
        <Text style={styles.itemText} numberOfLines={1}>
          Préstamo: {new Date(item.fechaPrestamo).toLocaleDateString()}
        </Text>
        <Text style={styles.itemPrice}>${item.precioPorDia}/día</Text>
        <Text style={styles.itemText}>Talla: {item.nombreTalla}</Text>
        <Text style={styles.itemText}>Estilo: {item.nombreEstilo}</Text>
      </View>
    </View>
  );
  

  const handleCheckout = () => {
    Alert.alert(
      'Confirmar Compra',
      '¿Estás seguro de que deseas proceder con el checkout?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => Alert.alert('Éxito', 'Proceso de checkout iniciado.'),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
        </View>
        {carrito.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
          </View>
        ) : (
          <FlatList
            data={carrito}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
        {carrito.length > 0 && (
          <View style={styles.checkoutContainer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Proceder al Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}