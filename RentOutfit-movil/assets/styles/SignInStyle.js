import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Definir el estilo del gradiente como un componente que se puede reutilizar
export const GradientBackground = ({ children }) => (
  <LinearGradient
    colors={['#0b4d6d', '#f0f7fa']} // Definir los colores del degradado
    style={styles.gradientContainer}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'thin',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'transparent',
    height: height * 0.3, // 25% del alto de la pantalla para el encabezado
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: width * 0.7, // 50% del ancho de la pantalla
    height: height * 0.5, // 20% del alto de la pantalla
  },
  // En SignInStyle.js
  forgotPasswordText: {
    fontSize: 14,
    color: '#E55B5B', // Cambia el color si deseas un enlace más visible
    textAlign: 'center',
    marginTop: 10,
  },

  inputContainer: {
    flex: 0.5, // 50% del ancho de la pantalla
    paddingHorizontal: 20,
    paddingTop: height * 0.1, // 10% del alto de la pantalla para el encabezado
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 50, // Ajustar el alto de cada campo para mantener la proporción
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#E55B5B',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#1c1917',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
