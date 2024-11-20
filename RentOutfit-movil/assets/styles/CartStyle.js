import { StyleSheet, Dimensions,Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
      },
      container: {
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      backButton: {
        marginRight: 15,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      emptyText: {
        fontSize: 18,
        color: '#888',
      },
      listContainer: {
        padding: 15,
      },
      itemContainer: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: height * 0.2, // Ajusta según el tamaño deseado
      },
      itemImage: {
        width: 120, // Igual al alto del contenedor
        height: '100%',
        borderRadius: 10,
        marginRight: 10, // Espacio entre la imagen y el contenido
      },
      itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
      },
      itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
      },
      itemText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
      },
      itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginTop: 5,
      },
      checkoutContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      },
      checkoutButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default styles;
