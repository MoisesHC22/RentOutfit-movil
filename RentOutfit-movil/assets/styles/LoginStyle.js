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
    content: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    backButton: {
      position: 'absolute',
      top: 40, // Adjust as needed for spacing
      left: 20, // Adjust as needed for spacing
      zIndex: 1,
    },
    logo: {
      width: width * 0.7,
      height: height * 0.5,
      borderRadius: 55,
    },
    button: {
      backgroundColor: '#2D2A25',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginBottom: 15,
      width: width * 0.9,
      alignItems: 'center',
    },
    buttonText: {
      color: '#C19F47',
      fontSize: 22,
      fontWeight: 'bold',
    },
    secondaryButton: {
      backgroundColor: '#2D2A25',
    }
  });

  export default styles;