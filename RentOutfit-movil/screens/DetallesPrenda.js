import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerInformacionPrenda } from '../Services/InformacionPrenda';
import SideMenu from '../components/Menu';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { agregarAlCarrito } from '../Services/AddCartService';
import { obtenerUbicacion } from '../Services/Location/locateService';

const { width } = Dimensions.get('window');

export default function DetallesPrenda({ route, navigation }) {
  const { id } = route.params;
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [cantidad, setCantidad] = useState(1); // Nueva funcionalidad para seleccionar cantidad de prendas
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log('ID recibido:', id);
    const fetchPrenda = async () => {
      try {
        const data = await obtenerInformacionPrenda(id);
        setPrenda(data);
      } catch (error) {
        Alert.alert('Error', 'Error al obtener la información de la prenda.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrenda();
  }, [id]);

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOutsidePress = () => {
    if (menuVisible) {
      setMenuVisible(false);
      Keyboard.dismiss();
    }
  };

  const handleLocationPress = async () => {
    try {
      const { ubicacion, codigoPostal } = await obtenerUbicacion();
      setCodigoPostal(codigoPostal);
      setUbicacionModalVisible(true);
    } catch (error) {
      setCodigoPostal(error.message);
      setUbicacionModalVisible(true);
    }
  };

  const closeModal = () => {
    setUbicacionModalVisible(false);
  };

  useEffect(() => {
    if (user?.token) {
      try {
        const decodedToken = jwtDecode(user.token.token);
        console.log('decodedToken:', decodedToken);
        setUserData(decodedToken);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [user]);

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para agregar prendas al carrito.',
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
      const itemCarrito = {
        usuarioID: userData.usuario, // Asegúrate de que `user` contenga el ID del usuario
        itemsCarrito: [
          {
            vestimentaID: id,
            stock: cantidad,
            fechaPrestamo: new Date().toISOString(),
          },
        ],
      };
      console.log('itemCarrito:', itemCarrito);
      await agregarAlCarrito(itemCarrito);
      Alert.alert('Éxito', 'Prenda añadida al carrito correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la prenda al carrito.');
    }
  };

  const incrementarCantidad = () => {
    if (cantidad < prenda.stock) {
      setCantidad(cantidad + 1);
    } else {
      Alert.alert('Stock insuficiente', 'No hay suficientes prendas disponibles.');
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const renderFixedHeader = () => (
    <View style={styles.fixedHeader}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>
      <TextInput style={styles.searchBox} placeholder="Buscar vestimenta" />
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
        <Ionicons name="location" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (!prenda) {
    return (
      <View style={styles.center}>
        <Text>No se pudo cargar la información de la prenda.</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}
        {renderFixedHeader()}

        <ScrollView contentContainerStyle={styles.container}>
  {/* Botón "Regresar" */}
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={32} color="#007AFF" />
    <Text style={styles.backButtonText}>Regresar</Text>
  </TouchableOpacity>

  {/* Información de la prenda */}
  <Text style={styles.title}>{prenda.nombrePrenda}</Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
    {[prenda.imagen1, prenda.imagen2, prenda.imagen3, prenda.imagen4].map((image, index) => (
      image ? (
        <TouchableOpacity key={index} onPress={() => openImage(image)}>
          <Image source={{ uri: image }} style={styles.image} />
        </TouchableOpacity>
      ) : null
    ))}
  </ScrollView>

  <Text style={styles.price}>
    ${prenda.precioPorDia} <Text style={styles.priceDetails}>IVA incluido</Text>
  </Text>

  <Text style={styles.description}>{prenda.descripcion}</Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>Talla: {prenda.nombreTalla || 'No disponible'}</Text>
            <Text style={styles.detail}>Estilo: {prenda.nombreEstilo || 'No disponible'}</Text>
            <Text style={styles.detail}>Stock: {prenda.stock}</Text>
            <Text style={styles.detail}>Fecha de Publicación: {new Date(prenda.fechaDePublicacion).toLocaleDateString()}</Text>
          </View>

          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterButton} onPress={decrementarCantidad}>
              <Ionicons name="remove-circle-outline" size={32} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{cantidad}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={incrementarCantidad}>
              <Ionicons name="add-circle-outline" size={32} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Rentar prenda</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0180CB',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 40,
  },
  menuButton: {
    padding: 5,
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  locationButton: {
    padding: 5,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageCarousel: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  image: {
    width: width * 0.5,
    height: width * 0.75,
    borderRadius: 15,
    marginHorizontal: 10,
    backgroundColor: '#eaeaea',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  priceDetails: {
    fontSize: 14,
    color: '#888',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  detailsContainer: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  detail: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  counterButton: {
    padding: 10,
  },
  counterText: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
