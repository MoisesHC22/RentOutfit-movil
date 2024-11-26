import React, { useState, useEffect, memo } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Pressable, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../components/Menu';
import { obtenerUbicacion } from '../Services/Location/locateService';
import { obtenerVestimentas } from '../Services/listVestimenta';

const { width } = Dimensions.get('window');

const VestimentaCard = memo(({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item.vestimentaID)}>
    {item.imagen1 ? (
      <Image
        source={{ uri: item.imagen1 }}
        style={styles.cardImage}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Imagen no disponible</Text>
      </View>
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.nombrePrenda}</Text>
      <Text style={styles.cardDetail}>Establecimiento: {item.nombreEstablecimiento}</Text>
      <Text style={styles.cardDetail}>Categoria: {item.nombreEstilo}</Text>
      <Text style={styles.cardDetail}>Talla: {item.nombreTalla}</Text>
    </View>
  </TouchableOpacity>
));

export default function VestimentasScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [filtroModalVisible, setFiltroModalVisible] = useState(false); // Modal de filtro
  const [codigoPostal, setCodigoPostal] = useState('');
  const [vestimentas, setVestimentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchVestimentas = async (selectedCategory = categoria, search = searchQuery) => {
    try {
      const estado = 'Hidalgo';
      const municipio = 'Tula de Allende';
      const pagina = 0;
  
      console.log('Fetching vestimentas con categoría:', selectedCategory, 'y filtro:', search); // Depuración
      const response = await obtenerVestimentas(estado, municipio, pagina, selectedCategory, search);
      setVestimentas(response);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las vestimentas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVestimentas();
  }, [categoria]); // Se ejecutará cuando `categoria` cambie

  const closeModal = () => {
    setUbicacionModalVisible(false);
  };

  const handleOutsidePress = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const goToDetails = (id) => {
    navigation.navigate('DetallesPrenda', { id });
  };

  const openFilterModal = () => {
    setFiltroModalVisible(true);
  };

  const closeFilterModal = () => {
    setFiltroModalVisible(false);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setLoading(true);
    fetchVestimentas(categoria, text); // Llama a la función con el término de búsqueda
  };

  const handleFilterSelect = (filter) => {
    const categoryMapping = {
      "Disfraces de Halloween": 6, // Asegúrate de que estos valores sean correctos
      "Disfraces Temáticos": 7,
      "Gala": 3,
    };
    const selectedCategory = categoryMapping[filter] || 0;
    setCategoria(selectedCategory); // Actualiza la categoría seleccionada
    closeFilterModal(); // Cierra el modal

    // Recarga las vestimentas con la nueva categoría
    setLoading(true); // Muestra el estado de carga mientras se actualizan
    fetchVestimentas(selectedCategory); // Llama a la función con la nueva categoría
  };

  const renderFixedHeader = () => (
    <View style={styles.fixedHeader}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchBox}
        placeholder="Buscar vestimenta"
        value={searchQuery}
        onChangeText={handleSearchChange} // Llama a la función al escribir
      />
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
        <Ionicons name="location" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderBackAndFilterButtons = () => (
    <View style={styles.backAndFilterContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={28} color="#007AFF" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
        <Ionicons name="filter" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}

        {/* Encabezado con barra fija */}
        {renderFixedHeader()}

        {/* Botones de Regresar y Filtros */}
        {renderBackAndFilterButtons()}

        {/* Lista de vestimentas */}
        <FlatList
          data={vestimentas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <VestimentaCard item={item} onPress={goToDetails} />}
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
          contentContainerStyle={styles.listContentCentered}
        />

        {/* Modal de ubicación */}
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

        {/* Modal de filtro */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filtroModalVisible}
          onRequestClose={closeFilterModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Cabecera */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecciona un Filtro</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeFilterModal}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Opciones de filtros */}
              <View style={styles.filterOptionsContainer}>
                {["Disfraces de Halloween", "Disfraces Temáticos", "Gala"].map((filtro, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.filterOption,
                      pressed && styles.filterOptionPressed, // Retroalimentación visual al presionar
                    ]}
                    onPress={() => handleFilterSelect(filtro)}
                  >
                    <Ionicons
                      name={filtro === "Disfraces de Halloween" ? "skull" : filtro === "Disfraces Temáticos" ? "color-palette" : "diamond"}
                      size={24}
                      color="#007AFF"
                      style={styles.filterIcon}
                    />
                    <Text style={styles.filterOptionText}>{filtro}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Estilos existentes
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
  backAndFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 5,
  },
  listContentCentered: {
    paddingBottom: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  menuButton: {
    marginRight: 15,
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
    marginRight: 15,
  },
  locationButton: {
    marginLeft: 10,
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

  // Nuevos estilos para el modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 5,
  },
  filterOptionsContainer: {
    marginTop: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 2,
  },
  filterOptionPressed: {
    backgroundColor: '#d9d9d9', // Color al presionar
  },
  filterIcon: {
    marginRight: 15,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

