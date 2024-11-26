import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listCart, obtenerPreferenceId } from '../../Services/listServices';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { agregarAlCarrito } from '../../Services/AddCartService';
import * as WebBrowser from 'expo-web-browser';
import { obtenerInformacionPrenda } from '../../Services/InformacionPrenda';
import styles from '../../assets/styles/CartStyle';

export default function CarritoScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  const mapCarritoItems = async (data) => {
    return Promise.all(
      data.map(async (item) => {
        const prendaData = await obtenerInformacionPrenda(item.vestimentaID);
        return {
          stockTotal: prendaData.stock,
          imagen1: prendaData.imagen1,
          precioPorDia: prendaData.precioPorDia,
          vestimentaEstatus: prendaData.vestimentaEstatus,
          nombreEstilo: prendaData.nombreEstilo,
          nombrePrenda: prendaData.nombrePrenda,
          nombreTalla: prendaData.nombreTalla,
          ...item, // Combina las propiedades originales de `data` (como `fechaPrestamo` y `vestimentaID`).
        };
      })
    );
  };

  const refreshCarrito = async () => {
    const data = await listCart(userData.usuario);
    const detailedInfo = await mapCarritoItems(data);
    setCarrito(detailedInfo);
    calculateTotal(detailedInfo);
  };


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
        const decodedToken = jwtDecode(user.token.token);
        const usuarioID = parseInt(decodedToken.usuario, 10);
        setUserData(decodedToken);

        const data = await listCart(usuarioID);

        const detailedInfo = await mapCarritoItems(data);

        setCarrito(detailedInfo);
        calculateTotal(detailedInfo);
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        Alert.alert('Error', 'No se pudo cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, [user]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.precioPorDia * item.stock), 0);
    setTotalAmount(total);
  };

  const handleIncrease = async (item) => {
    try {
      if ((item.stock + 1) <= item.stockTotal) {
        const itemCarrito = {
          usuarioID: userData.usuario, // Asegúrate de que `user` contenga el ID del usuario
          itemsCarrito: [
            {
              vestimentaID: item.vestimentaID,
              stock: item.stock + 1,
              fechaPrestamo: item.fechaPrestamo,
            },
          ],
        };
        await agregarAlCarrito(itemCarrito);
        refreshCarrito();
        return;
      }
      Alert.alert('Lo sentimos!!', 'No hay suficientes piezas disponibles');
    } catch (error) {
      Alert.alert('Lo sentimos!!', 'Revisa tu conexión a internet');
    }
  };

  const handleDecrease = async (item) => {
    try {
      if ((item.stock - 1) > 0) {
        const itemCarrito = {
          usuarioID: userData.usuario, // Asegúrate de que `user` contenga el ID del usuario
          itemsCarrito: [
            {
              vestimentaID: item.vestimentaID,
              stock: item.stock - 1,
              fechaPrestamo: item.fechaPrestamo,
            },
          ],
        };
        await agregarAlCarrito(itemCarrito);
        refreshCarrito();
        return;
      }
      Alert.alert('Advertencia', 'La cantidad no pude ser menor a 1 pieza.');
    } catch (error) {
      Alert.alert('Lo sentimos!!', 'Revisa tu conexión a internet');
    }
  };

  const handleRemove = async (item) => {
    Alert.alert(
      'Eliminar artículo',
      '¿Estás seguro de que quieres eliminar este artículo del carrito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const itemCarrito = {
                usuarioID: userData.usuario, // Asegúrate de que `user` contenga el ID del usuario
                itemsCarrito: [
                  {
                    vestimentaID: item.vestimentaID,
                    stock: 0,
                    fechaPrestamo: item.fechaPrestamo,
                  },
                ],
              };
              await agregarAlCarrito(itemCarrito);
              refreshCarrito();
            } catch (error) {
              console.log(error);
              Alert.alert('Lo sentimos!!', 'Revisa tu conexión a internet');
            }
          },
        },
      ]
    );
  };

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
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDecrease(item)}
        >
          <Ionicons name="remove-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.stock}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleIncrease(item)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemove(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

    </View>
  );

  const handleCheckout = () => {
    Alert.alert(
      'Confirmar Compra',
      `¿Estás seguro de que deseas proceder con el checkout? El total es $${totalAmount.toFixed(2)}.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              const usuarioId = parseInt(userData.usuario, 10);

              // Obtén el preferenceId desde tu backend
              const { preferenceId } = await obtenerPreferenceId(usuarioId);
              console.log('preferenceId cart:', preferenceId);

              // Construye la URL para Mercado Pago Checkout
              const url = `https://www.mercadopago.com.mx/checkout/v1/redirect?preference-id=${preferenceId}&redirect_mode=web`;

              // Abre el navegador para completar el flujo de pago
              const result = await WebBrowser.openBrowserAsync(url);
              console.log('result:', result);
              if (result.type === 'dismiss') {
                // Aquí puedes manejar la redirección al home o estado después de cerrar el navegador
                Alert.alert(
                  'Estado desconocido',
                  'Revisa el estado de tu transacción en Mercado Pago.',
                );
              }
            } catch (error) {
              console.error('Error en el flujo de pago:', error);
              Alert.alert('Error', 'No se pudo completar el pago.');
            }
          },
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
            <Ionicons name="cart-outline" size={64} color="#888" />
            <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={carrito}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.checkoutContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceder al Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

