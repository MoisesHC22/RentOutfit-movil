import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerInformacionPrenda } from '../Services/InformacionPrenda';
import SideMenu from '../components/Menu';
import { obtenerUbicacion } from '../Services/Location/locateService';

const { width } = Dimensions.get('window');

export default function DetallesPrenda({ route, navigation }) {
  const { id } = route.params;
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
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
          <Text style={styles.title}>{prenda.nombrePrenda}</Text>
          
          {/* Galería de imágenes */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
            {[prenda.imagen1, prenda.imagen2, prenda.imagen3, prenda.imagen4].map((image, index) => (
              image ? (
                <TouchableOpacity key={index} onPress={() => openImage(image)}>
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
              ) : null
            ))}
          </ScrollView>

          {/* Modal para mostrar imagen en pantalla completa */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            </View>
          </Modal>

          <Text style={styles.price}>${prenda.precioPorDia} <Text style={styles.priceDetails}>IVA incluido</Text></Text>
          
          <Text style={styles.description}>{prenda.descripcion}</Text>
          
          {/* Calificación y otros detalles */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>Talla: {prenda.nombreTalla || 'No disponible'}</Text>
            <Text style={styles.detail}>Estilo: {prenda.nombreEstilo || 'No disponible'}</Text>
            <Text style={styles.detail}>Stock: {prenda.stock}</Text>
            <Text style={styles.detail}>Fecha de Publicación: {new Date(prenda.fechaDePublicacion).toLocaleDateString()}</Text>
          </View>

          {/* Botones */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Rentar prenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buyButton]}>
            <Text style={styles.buttonText}>Comprar prenda</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={ubicacionModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Ionicons name="location" size={64} color="#007AFF" style={styles.modalIcon} />
              <Text style={styles.modalTitle}>¡Ubicación obtenida!</Text>
              <Text style={styles.modalText}>Tu código postal es:</Text>
              <Text style={styles.modalPostalCode}>{codigoPostal}</Text>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0180CB',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 40,
    zIndex: 1,
  },
  menuButton: {
    marginRight: 15,
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: '#fff',
    marginRight: 15,
  },
  locationButton: {
    marginLeft: 10,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageCarousel: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  priceDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    textAlign: 'justify',
  },
  detailsContainer: {
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buyButton: {
    backgroundColor: '#004A7F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0180CB',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  modalPostalCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0180CB',
    marginBottom: 20,
  },
});
