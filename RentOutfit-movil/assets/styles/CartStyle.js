import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? height * 0.05 : 0, // Adjust padding based on Android or iOS
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04, // Responsive padding
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: width * 0.03, // Dynamic spacing
  },
  headerTitle: {
    fontSize: width * 0.05, // Adjust font size
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
    padding: width * 0.05,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#888',
    marginTop: width * 0.02,
    marginBottom: width * 0.05,
  },
  continueShoppingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: width * 0.04,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: width * 0.04,
    marginBottom: width * 0.04,
    borderRadius: width * 0.03,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: height * 0.2,
  },
  itemImage: {
    width: width * 0.25, // Adjust image size based on screen width
    height: '100%',
    borderRadius: width * 0.03,
    marginRight: width * 0.03,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: width * 0.02,
  },
  itemText: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: width * 0.02,
  },
  itemPrice: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: width * 0.02,
  },
  actionsContainer: {
    flexDirection: 'column', // Align actions vertically
    alignItems: 'center', // Center-align items horizontally
    justifyContent: 'space-between', // Evenly space actions vertically
    marginLeft: 10, // Add spacing from details section
  },
  actionButton: {
    flex: 1, // Allow the button to grow and fill available space
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5, // Adjust spacing between items relative to container size
  },  
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5, // Spacing around the quantity text
  },
  checkoutContainer: {
    padding: width * 0.04,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: width * 0.04,
  },
  totalText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default styles;
