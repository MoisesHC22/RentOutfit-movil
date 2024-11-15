import React, { useState, useEffect, memo } from 'react';
import {SafeAreaView,View,Text,TextInput,TouchableOpacity,StyleSheet,Dimensions,Modal,Pressable,Image,FlatList,TouchableWithoutFeedback,Keyboard,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../../components/Menu';
import { obtenerUbicacion } from '../../Services/Location/locateService';
import { obtenerEstablecimientosCercanos } from '../../Services/listEstablecimientos';

const { width } = Dimensions.get('window');

const EstablecimientoCard = memo(({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item.establecimientosID)}>
    {item.linkImagenEstablecimiento ? (
      <Image
        source={{ uri: item.linkImagenEstablecimiento }}
        style={styles.cardImage}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Imagen no disponible</Text>
      </View>
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.nombreEstablecimiento || 'Nombre no disponible'}</Text>
      <Text style={styles.cardDetail}>Calle: {item.calle || 'No disponible'}</Text>
      <Text style={styles.cardDetail}>Estado: {item.nombreEstado || 'No disponible'}</Text>
      <Text style={styles.cardDetail}>Municipio: {item.nombreMunicipio || 'No disponible'}</Text>
    </View>
  </TouchableOpacity>
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

  const fetchEstablecimientos = async () => {
    try {
      const estado = 'Hidalgo';
      const municipio = 'Tula de Allende';
      const pagina = 0;
      const response = await obtenerEstablecimientosCercanos(estado, municipio, pagina);

      console.log('API Response:', response); // Debug
      setEstablecimientos(response);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los establecimientos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const closeModal = () => {
    setUbicacionModalVisible(false);
  };

  const goToDetails = (id) => {
    console.log('ID enviado:', id); // Debugging
    navigation.navigate('DetallesLocal', { id });
  };


  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}

        <View style={styles.fixedHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={32} color="black" />
          </TouchableOpacity>
          <TextInput style={styles.searchBox} placeholder="Buscar establecimientos" />
          <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
            <Ionicons name="location" size={32} color="black" />
          </TouchableOpacity>
        </View>

        {/* Botones principales */}
        <View style={styles.categoryContainer}>
          {[
            { name: 'Prendas', icon: 'shirt-outline', screen: 'VestimentasScreen' },
            { name: 'Calzado', icon: 'footsteps-outline' },
            { name: 'Hombre', icon: 'man-outline' },
            { name: 'Mujer', icon: 'woman-outline' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => category.screen && navigation.navigate(category.screen)}
            >
              <Ionicons name={category.icon} size={32} color="white" />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de establecimientos */}
        <FlatList
          data={establecimientos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <EstablecimientoCard item={item} onPress={goToDetails} />}
          ListEmptyComponent={() =>
            loading ? (
              <Text style={styles.loadingText}>Cargando establecimientos...</Text>
            ) : (
              <Text style={styles.noDataText}>No se encontraron establecimientos cercanos.</Text>
            )
          }
          contentContainerStyle={styles.listContentCentered}
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
    backgroundColor: '#0180CB',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 40,
    zIndex: 1,
  },
  listContentCentered: {
    paddingBottom: 20,
    alignItems: 'center',
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
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#0180CB',
    padding: 15,
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
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
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
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
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginRight: 10,
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
  closeButton: {
    backgroundColor: '#0180CB',
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
