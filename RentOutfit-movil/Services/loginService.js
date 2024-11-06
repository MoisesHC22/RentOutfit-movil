import { validateEmail } from '../components/Validaciones/validateEmail'; // Importar la validación
import { validatePassword } from '../components/Validaciones/validatePassword';
import { login as loginService, register as registerService, recoverPassword as recoverPasswordService } from './authService'; // Importar correctamente la función login

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
    return 'El nombre no puede estar vacío.';
  }

  if (!userData.apellidoPaterno.trim()) {
    return 'El apellido paterno no puede estar vacío.';
  }

  if (!userData.apellidoMaterno.trim()) {
    return 'El apellido materno no puede estar vacío.';
  }

  if (!validateEmail(userData.email)) {
    return 'Por favor ingresa un correo electrónico válido.';
  }

  if (!userData.telefono.trim() || userData.telefono.length < 10) {
    return 'Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).';
  }

  if (!validatePassword(contraseña)) {
    return 'La contraseña debe tener al menos una mayúscula, dos números y 8 caracteres.';
  }

  if (!userData.selectedGenero) {
    return 'Por favor selecciona tu género.';
  }

  if (!userData.imagen) {
    return 'Por favor selecciona una imagen antes de continuar.';
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

export const handlerecoverPassword = async (email) => {
  try {
    const response = await recoverPasswordService(email);
    if (response != null) {
      return response; // Devuelve el response en caso de éxito
    } else {
      return null; // Devuelve null si no se encuentra el usuario
    }
  } catch (error) {
    setErrorMessage('Error al encontrar el correo. Inténtalo de nuevo más tarde.');
  }
};

