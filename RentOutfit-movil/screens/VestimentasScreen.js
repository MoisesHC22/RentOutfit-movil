import React, { useState, useEffect, memo } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Pressable, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from '../components/Menu';
import { obtenerUbicacion } from '../Services/Location/locateService';
import { obtenerVestimentas } from '../Services/listVestimenta';

const { width } = Dimensions.get('window');

const VestimentaCard = memo(({ item }) => (
  <View style={styles.card}>
    {item.imagen1 ? (
      <Image 
        source={{ uri: item.imagen1 }}
        style={styles.cardImage}
        resizeMode="contain" // Ajusta la imagen dentro de los bordes de la tarjeta
      />
    ) : (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Imagen no disponible</Text>
      </View>
    )}
    <Text style={styles.cardTitle}>{item.nombrePrenda}</Text>
    <Text style={styles.cardDetail}>Descripción: {item.descripcion}</Text>
    <Text style={styles.cardDetail}>Establecimiento: {item.nombreEstablecimiento}</Text>
  </View>
));

export default function VestimentasScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [vestimentas, setVestimentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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

  const fetchVestimentas = async () => {
    try {
      const estado = 'Mexico';
      const municipio = 'Huehuetoca';
      const pagina = 0;
      const response = await obtenerVestimentas(estado, municipio, pagina);
      setVestimentas(response);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las vestimentas', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVestimentas();
  }, []);

  const closeModal = () => {
    setUbicacionModalVisible(false);
  };

  const handleOutsidePress = () => {
    if (menuVisible) {
      setMenuVisible(false);
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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}

        {renderFixedHeader()}

        <FlatList
          data={vestimentas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <VestimentaCard item={item} />}
          ListEmptyComponent={() => (
            loading ? (
              <Text style={styles.loadingText}>Cargando vestimentas...</Text>
            ) : (
              <Text style={styles.noDataText}>No se encontraron vestimentas disponibles.</Text>
            )
          )}
          initialNumToRender={5}
          windowSize={5}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listContentCentered} // Centrar contenido
        />

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
      </SafeAreaView>
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
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 40,
    zIndex: 1,
  },
  listContentCentered: {
    paddingBottom: 20,
    alignItems: 'center', // Centra las tarjetas en el FlatList
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 100, // Ajusta la altura de la imagen a 100 para que se vea proporcional
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDetail: {
    fontSize: 14,
    color: '#333',
  },
  placeholderContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    color: '#007AFF',
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
    color: '#007AFF',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
