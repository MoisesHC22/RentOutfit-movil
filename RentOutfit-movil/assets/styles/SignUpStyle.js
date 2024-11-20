import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop:  height * 0.05,  // Reduce el paddingTop para acercar el título
    alignItems: 'center',
    marginBottom: height * -0.15,            // Asegura que haya margen debajo del título si es necesario
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  backArrowContainer: {
    position: 'absolute',
    top: height * 0.05, // Adjust based on your layout
    left: 15,
    zIndex: 1,
  },  
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  page: {
    width: width,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0c4a6e',
    padding: 1,
    marginTop: width * 0.05, // Espacio superior
    marginBottom: width * 0.05, // Espacio inferior
  },
  pickerText: {
    fontSize: 16,
    color: '#0c4a6e',
  },  
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2, // Alinear con la primera línea de texto
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  link: {
    color: '#fbbf24',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbbf24', // Color amarillo para el botón activo
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10, // Añadimos margen derecho al botón "Atrás"
  },
  createAccountButton: {
    marginLeft: 10, // Añadimos margen izquierdo al botón "Crear Cuenta"
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#0c4a6e', // Color oscuro para el texto sobre fondo amarillo
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(204, 204, 204, 0.6)',
  },
  disabledButtonText: {
    color: '#666', // Color más oscuro para el texto del botón deshabilitado
  },
  buttonText: {
    color: '#0c4a6e',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#fbbf24',
    textAlign: 'center',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#fbbf24',
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
  },
  activeStepText: {
    color: '#0c4a6e',
    fontWeight: 'bold',
  },
  progressDivider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeProgressDivider: {
    backgroundColor: '#fbbf24',
  },
  imagenPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: 10, // Espacio entre la imagen y el botón
  },
  imageContainer: {
    flexDirection: 'row',  // Coloca el botón y la imagen en horizontal
    alignItems: 'center',  // Alinea verticalmente el contenido
    marginTop: 10,
  },
  imageButton: {
    flexDirection: 'row',  // Coloca el ícono y el texto en línea
    alignItems: 'center',  // Alinea verticalmente el ícono y el texto
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#0c4a6e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6, // Añadimos opacidad para hacerlo más visible
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
