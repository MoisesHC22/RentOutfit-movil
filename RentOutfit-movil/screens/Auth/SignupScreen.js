import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Dimensions, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { validateEmail } from '../../components/Validaciones/validateEmail';
import Checkbox from 'expo-checkbox';
import RNPickerSelect from 'react-native-picker-select';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../assets/styles/SignUpStyle';
import { listGeneros } from '../../Services/listServices';
import * as ImageManipulator from 'expo-image-manipulator';
import { handleSignup } from '../../Services/loginService';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState(''); // Campo de confirmación de contraseña
  const [showPassword, setShowPassword] = useState(false); // Controla la visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Controla la visibilidad de la confirmación de contraseña
  const [imagen, setImagen] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para controlar el modal y su tipo (éxito o error)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'error' o 'success'

  const scrollViewRef = useRef(null);

  // Función para validar la contraseña (al menos una mayúscula, dos números y 8 caracteres)
  const validarContraseña = (contraseña) => {
    const mayuscula = /[A-Z]/;
    const numeros = /\d.*\d/; // Al menos dos dígitos
    const longitud = /.{8,}/; // Mínimo 8 caracteres
    return mayuscula.test(contraseña) && numeros.test(contraseña) && longitud.test(contraseña);
  };
  

  const seleccionarImagen = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log('Imagen seleccionada:', manipResult.uri);
        setImagen(manipResult.uri);
      } else {
        console.log('Selección de imagen cancelada o sin URI');
      }
    } catch (error) {
      console.error('Error al seleccionar o manipular la imagen:', error);
    }
  };

  const onSignup = async () => {
    setIsLoading(true);
    try {
      // Verificar si las contraseñas coinciden
      if (contraseña !== confirmarContraseña) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      // Verificar si la contraseña cumple con los requisitos
      if (!validarContraseña(contraseña)) {
        Alert.alert('Error', 'La contraseña debe tener al menos una mayúscula, dos números y 8 caracteres.');
        return;
      }

      // Datos del usuario a enviar
      const userData = {
        nombreCliente,
        apellidoPaterno,
        apellidoMaterno,
        email,
        telefono,
        contraseña,
        selectedGenero,
        imagen,
      };

      // Llamar a la función register del servicio
      const result = await handleSignup(userData, setIsLoading);
      if (result != null) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente.');
        navigation.navigate('SignIn');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear la cuenta. Inténtalo de nuevo.');
      console.error('Error al crear la cuenta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerDatos = async () => {
    try {
      const generosResponse = await listGeneros();
      setGeneros(generosResponse);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los géneros. Por favor, intenta de nuevo.');
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleScroll = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < 2) {
      scrollViewRef.current.scrollTo({ x: (currentPage + 1) * width, animated: true });
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      scrollViewRef.current.scrollTo({ x: (currentPage - 1) * width, animated: true });
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <LinearGradient
        colors={['#0b4d6d', '#f0f7fa']}
        style={styles.gradient}
      >
        <StatusBar style="light" />
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {[0, 1, 2].map((step) => (
              <React.Fragment key={step}>
                <View style={[styles.step, currentPage >= step && styles.activeStep]}>
                  <Text style={[styles.stepText, currentPage >= step && styles.activeStepText]}>{step + 1}</Text>
                </View>
                {step < 2 && <View style={[styles.progressDivider, currentPage > step && styles.activeProgressDivider]} />}
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={[styles.page, { width }]}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre(s)"
                placeholderTextColor="#999"
                value={nombreCliente}
                onChangeText={setNombreCliente}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                placeholderTextColor="#999"
                value={apellidoPaterno}
                onChangeText={setApellidoPaterno}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                placeholderTextColor="#999"
                value={apellidoMaterno}
                onChangeText={setApellidoMaterno}
              />
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={goToNextPage}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.page, { width }]}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
                <Ionicons name="image-outline" size={24} color="#fff" />
                <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
              </TouchableOpacity>

              {imagen && (
                <Image source={{ uri: imagen }} style={styles.imagenPreview} />
              )}
            </View>

            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedGenero(itemValue)}
              items={generos.map((genero) => ({
                label: genero.nombreGenero,
                value: genero.generoID,
              }))}
              placeholder={{ label: 'Selecciona tu género', value: null }}
              style={pickerSelectStyles}
              value={selectedGenero}
            />

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Número Telefónico"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity style={styles.backButton} onPress={goToPreviousPage}>
                <Text style={styles.backButtonText}>Atrás</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={goToNextPage}>
                <Text style={styles.nextButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.page, { width }]}>
            <Text style={styles.sectionTitle}>Finalizar Registro</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Campo de contraseña con opción de mostrar/ocultar */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword} // Controlar visibilidad de la contraseña
                value={contraseña}
                onChangeText={setContraseña}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#0c4a6e" />
              </TouchableOpacity>
            </View>

            {/* Confirmar contraseña con opción de mostrar/ocultar */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#0c4a6e" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword} // Controlar visibilidad de la confirmación de contraseña
                value={confirmarContraseña}
                onChangeText={setConfirmarContraseña}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#0c4a6e" />
              </TouchableOpacity>
            </View>

            {/* Frase actualizada para términos y condiciones y política de privacidad */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#0c4a6e' : undefined}
              />
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>
                  Acepto los{' '}
                  <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>
                    Términos y condiciones
                  </Text>
                  {' '}y la{' '}
                  <Text style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>
                    Política de privacidad
                  </Text>
                  .
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={goToPreviousPage}
              >
                <Text style={styles.backButtonText}>Atrás</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, (!isChecked || isLoading) && styles.disabledButton]}
                onPress={onSignup}
                disabled={!isChecked || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#0c4a6e',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0c4a6e',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});
