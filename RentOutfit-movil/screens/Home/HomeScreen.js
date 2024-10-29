import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Pressable, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from '../../components/Menu'; // Asegúrate de que la ruta sea correcta
import { obtenerUbicacion } from '../../Services/Location/locateService'; // Importa la clase de obtenerUbicacion.js
import { obtenerEstablecimientosCercanos } from '../../Services/listEstablecimientos'; // Importa la función de la API

const { width } = Dimensions.get('window');

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [ubicacionModalVisible, setUbicacionModalVisible] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState('');
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alternar el menú lateral
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Función para manejar la acción de presionar el icono de ubicación
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

  // Función para hacer la solicitud a la API y obtener los establecimientos cercanos
  const fetchEstablecimientos = async () => {
    try {
      const estado = 'Hidalgo'; // Reemplazar con un valor válido
      const municipio = 'Tula de Allende'; // Reemplazar con un valor válido
      const pagina = 0;
      const response = await obtenerEstablecimientosCercanos(estado, municipio, pagina);
      
      console.log("Datos obtenidos de la API:", response); // Verifica los datos recibidos

      setEstablecimientos(response); // Guardamos los datos en el estado
      setLoading(false); // Desactivamos el estado de cargando
    } catch (error) {
      console.error('Error al obtener los establecimientos', error);
      setLoading(false); // Desactivamos el estado de cargando
    }
  };

  // Usar useEffect para hacer la solicitud al cargar la pantalla
  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  // Función para cerrar el modal
  const closeModal = () => {
    setUbicacionModalVisible(false);
  };

  // Función para cerrar el menú si se hace clic fuera de él
  const handleOutsidePress = () => {
    if (menuVisible) {
      setMenuVisible(false); // Cierra el menú si está abierto
    }
  };

  // Renderizado del encabezado fijo (menú, barra de búsqueda y botón de ubicación)
  const renderFixedHeader = () => (
    <View style={styles.fixedHeader}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>
      <TextInput style={styles.searchBox} placeholder="Buscar local o vestimenta" />
      <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
        <Ionicons name="location" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );

  // Renderizado de los botones de categorías
  const renderCategories = () => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity style={styles.categoryButton}>
        <Ionicons name="shirt-outline" size={28} color="white" style={styles.categoryIcon} />
        <Text style={styles.categoryText}>Ropa formal</Text>
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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeArea}>
        {menuVisible && <SideMenu closeMenu={toggleMenu} />}
        
        {/* Encabezado fijo */}
        {renderFixedHeader()}

        {/* Contenido desplazable */}
        <FlatList
          data={establecimientos}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderCategories} // Muestra los botones de categorías como encabezado de la lista
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Mostrar la imagen del establecimiento */}
              <Image 
                source={{ uri: item.linkImagenEstablecimiento }}
                style={styles.cardImage}
              />
              {/* Detalles del establecimiento */}
              <Text style={styles.cardTitle}>{item.nombreEstablecimiento}</Text> 
              <Text style={styles.cardDetail}>Calle: {item.calle}</Text>
              <Text style={styles.cardDetail}>Estado: {item.nombreEstado}</Text>
              <Text style={styles.cardDetail}>Municipio: {item.nombreMunicipio}</Text>
              <Text style={styles.cardDetail}>Código Postal: {item.codigoPostal}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            loading ? (
              <Text style={styles.loadingText}>Cargando establecimientos...</Text>
            ) : (
              <Text style={styles.noDataText}>No se encontraron establecimientos cercanos.</Text>
            )
          )}
          contentContainerStyle={styles.listContent}
        />

        {/* Modal para mostrar el código postal */}
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
    zIndex: 1, // Asegura que el encabezado esté encima del contenido scrolleable
  },
  listContent: {
    paddingBottom: 20,
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
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
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
