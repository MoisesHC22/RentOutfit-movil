import { validateEmail } from '../components/Validaciones/validateEmail'; // Importar la validación
import { login as loginService, register as registerService } from './authService'; // Importar correctamente la función login

// Lógica de manejo del inicio de sesión
export const handleLogin = async (email, password, navigation, setErrorMessage) => {
  // Validación de correo electrónico
  if (!validateEmail(email)) {
    setErrorMessage('Correo electrónico inválido');
    return;
  }

  try {
    // Llamada al servicio de login
    const response = await loginService(email, password);

    // Verificar si la respuesta contiene un token
    if (response != null) {
      return response; // Devuelve el response en caso de éxito
    } else {
      return null; // Devuelve null si no se encuentra el usuario
    }
  } catch (error) {
    setErrorMessage('Error al iniciar sesión, por favor intenta de nuevo');
  }
};


export const handleSignup = async (userData, setIsLoading) => {
  // Validar todos los campos antes de enviar
  if (!userData.nombreCliente.trim()) {
    Alert.alert('Error', 'El nombre no puede estar vacío.');
    return null;
  }

  if (!userData.apellidoPaterno.trim()) {
    Alert.alert('Error', 'El apellido paterno no puede estar vacío.');
    return null;
  }

  if (!userData.apellidoMaterno.trim()) {
    Alert.alert('Error', 'El apellido materno no puede estar vacío.');
    return null;
  }

  if (!validateEmail(userData.email)) {
    Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
    return null;
  }

  if (!userData.telefono.trim() || userData.telefono.length < 10) {
    Alert.alert('Error', 'Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).');
    return null;
  }

  if (!userData.contraseña || userData.contraseña.length < 8) {
    Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
    return null;
  }

  if (!userData.selectedGenero) {
    Alert.alert('Error', 'Por favor selecciona tu género.');
    return null;
  }

  if (!userData.imagen) {
    Alert.alert('Error', 'Por favor selecciona una imagen antes de continuar.');
    return null;
  }

  setIsLoading(true);

  // Construir FormData para enviar todos los datos
  const formData = new FormData();
  formData.append('nombreCliente', userData.nombreCliente);
  formData.append('apellidoPaterno', userData.apellidoPaterno);
  formData.append('apellidoMaterno', userData.apellidoMaterno);
  formData.append('email', userData.email);
  formData.append('telefono', userData.telefono);
  formData.append('contrasena', userData.contraseña);
  formData.append('generoID', userData.selectedGenero); // Suponiendo que selectedGenero contiene el ID del género seleccionado

  // Añadir imagen seleccionada al FormData
  formData.append('imagen', {
    uri: userData.imagen, // La URI de la imagen seleccionada
    name: 'profile.jpg', // Nombre del archivo
    type: 'image/jpeg', // Tipo MIME
  });
  try {
    // Enviar la petición POST al servidor
    const response = await registerService(formData);  // Aquí asegúrate de importar correctamente `registerService`

    if (response != null) {
      return response; // Devuelve el response en caso de éxito
    } else {
      return null; // Devuelve null si no se encuentra el usuario
    }
  } catch (error) {
    Alert.alert('Error', 'Error de conexión al servidor. Inténtalo de nuevo más tarde.');
  } finally {
    setIsLoading(false);
  }
};


