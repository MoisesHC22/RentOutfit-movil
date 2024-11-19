import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from '../components/Menu';
import { obtenerUbicacion } from '../Services/Location/locateService';
import { obtenerInformacionEstablecimiento } from '../Services/InformacionLocal';

const { width } = Dimensions.get('window');

export default function DetallesLocal({ route, navigation }) {
  const { id } = route.params;
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log('ID recibido:', id);
    const fetchLocal = async () => {
      try {
        const data = await obtenerInformacionEstablecimiento(id);
        setLocal(data);
      } catch (error) {
        console.error('Error al obtener los datos del local:', error.response?.data || error.message);
        Alert.alert('Error', 'Error al obtener la información del local.');
      } finally {
        setLoading(false);
      }
    };
    fetchLocal();
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
      <TextInput style={styles.searchBox} placeholder="Buscar establecimientos" />
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
        <Ionicons name="location" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (!local) {
    return (
      <View style={styles.center}>
        <Text>No se pudo cargar la información del local.</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}
        {renderFixedHeader()}

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{local.nombreEstablecimiento}</Text>

          {/* Imagen del establecimiento */}
          {local.linkImagenEstablecimiento && (
            <TouchableOpacity onPress={() => openImage(local.linkImagenEstablecimiento)}>
              <Image source={{ uri: local.linkImagenEstablecimiento }} style={styles.image} />
            </TouchableOpacity>
          )}

          {/* Modal para mostrar imagen en pantalla completa */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            </View>
          </Modal>

          {/* Detalles del establecimiento */}
          <View style={styles.detailsCard}>
            <Text style={styles.detail}>Estado: {local.nombreEstado}</Text>
            <Text style={styles.detail}>Municipio: {local.municipio}</Text>
            <Text style={styles.detail}>Colonia: {local.colonia}</Text>
            <Text style={styles.detail}>Calle: {local.calle}</Text>
            <Text style={styles.detail}>Código Postal: {local.codigoPostal}</Text>
          </View>

          {/* Información del propietario */}
          <View style={styles.ownerCard}>
            <Text style={styles.sectionTitle}>Propietario</Text>
            <Image source={{ uri: local.linkImagenPerfil }} style={styles.profileImage} />
            <Text style={styles.ownerName}>
              {`${local.nombreCliente} ${local.apellidoPaterno} ${local.apellidoMaterno}`}
            </Text>
          </View>
        </ScrollView>
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
    backgroundColor: '#f9f9f9',
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  ownerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  ownerName: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
