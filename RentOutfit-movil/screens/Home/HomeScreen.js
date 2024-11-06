import React, { useState, useEffect, memo } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Pressable, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../../components/Menu';
import { obtenerUbicacion } from '../../Services/Location/locateService';
import { obtenerEstablecimientosCercanos } from '../../Services/listEstablecimientos';

const { width } = Dimensions.get('window');

const EstablecimientoCard = memo(({ item }) => (
  <View style={styles.card}>
    {item.linkImagenEstablecimiento ? (
      <Image 
        source={{ uri: item.linkImagenEstablecimiento }}
        style={styles.cardImage}
        resizeMode="contain" // Ajusta la imagen dentro de los bordes de la tarjeta
      />
    ) : (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Imagen no disponible</Text>
      </View>
    )}
    <Text style={styles.cardTitle}>{item.nombreEstablecimiento}</Text> 
    <Text style={styles.cardDetail}>Calle: {item.calle}</Text>
    <Text style={styles.cardDetail}>Estado: {item.nombreEstado}</Text>
    <Text style={styles.cardDetail}>Municipio: {item.nombreMunicipio}</Text>
    <Text style={styles.cardDetail}>Código Postal: {item.codigoPostal}</Text>
  </View>
));

export default function HomeScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [establecimientos, setEstablecimientos] = useState([]);
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

  const fetchEstablecimientos = async () => {
    try {
      const estado = 'Hidalgo';
      const municipio = 'Tula de Allende';
      const pagina = 0;
      const response = await obtenerEstablecimientosCercanos(estado, municipio, pagina);

      setEstablecimientos(response);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los establecimientos', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablecimientos();
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

  const renderCategories = () => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity 
        style={styles.categoryButton} 
        onPress={() => navigation.navigate('VestimentasScreen')}
      >
        <Ionicons name="shirt-outline" size={28} color="white" />
        <Text style={styles.categoryText}>Prendas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Ionicons name="footsteps-outline" size={28} color="white" style={styles.categoryIcon} />
        <Text style={styles.categoryText}>Calzado</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Ionicons name="man-outline" size={28} color="white" style={styles.categoryIcon} />
        <Text style={styles.categoryText}>Hombre</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Ionicons name="woman-outline" size={28} color="white" style={styles.categoryIcon} />
        <Text style={styles.categoryText}>Mujer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => <EstablecimientoCard item={item} />;

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}

        {renderFixedHeader()}

        <FlatList
          data={establecimientos}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderCategories}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            loading ? (
              <Text style={styles.loadingText}>Cargando establecimientos...</Text>
            ) : (
              <Text style={styles.noDataText}>No se encontraron establecimientos cercanos.</Text>
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 15,
    width: width * 0.4,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
    height: 100,
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
