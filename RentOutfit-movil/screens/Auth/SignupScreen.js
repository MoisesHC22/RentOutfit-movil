import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { validateEmail } from '../../components/Validaciones/validateEmail';
import Checkbox from 'expo-checkbox';
import RNPickerSelect from 'react-native-picker-select'; // Importar Picker estilizado
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker'; // Para la selección de imagen
import styles from '../../assets/styles/SignUpStyle'; // Importar tus estilos
import { listGeneros, listMunicipios, listEstados } from '../../Services/listServices'
const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

export default function SignupScreen({ navigation }) {
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [codigoPostal, setCodigoPostal] = useState(''); const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [telefono, setTelefono] = useState('');
  const [noInt, setNoInt] = useState('');
  const [noExt, setNoExt] = useState('');
  const [contraseña, setContraseña] = useState(''); const [imagen, setImagen] = useState(null); // Estado para la imagen seleccionada
  const [generos, setGeneros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState(''); // Estado para género seleccionado
  const [selectedEstado, setSelectedEstado] = useState(''); // Estado para estado seleccionado
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [municipiosDisabled, setMunicipiosDisabled] = useState(true); // Estado para deshabilitar el campo de municipios
  // Función para manejar la selección de la imagen
  const seleccionarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImagen(result.uri); // Guardar la URI de la imagen seleccionada
    }
  };

  // Función para manejar el registro
  const handleSignup = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!isChecked) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones.');
      return;
    }

    // Lógica para enviar los datos a tu backend

    Alert.alert('Éxito', 'Cuenta creada exitosamente.');
    navigation.navigate('SignIn');
  };

  // Función para obtener los datos de la base de datos (género, estado, municipio)
  const obtenerDatos = async () => {
    try {
      // Aquí debes hacer las solicitudes API para obtener los géneros, estados y municipios
      const generosResponse = await listGeneros();
      const estadosResponse = await listEstados();
      setGeneros(generosResponse); // Guardar los géneros en el estado
      setEstados(estadosResponse); // Guardar los estados en el estado
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    obtenerDatos(); // Llamar a la función para obtener los datos cuando se cargue la pantalla
  }, []);

  // Función para obtener los municipios cuando se seleccione un estado
  const obtenerMunicipios = async (estadoID) => {
    if (estadoID) {
    try {
      // Llama a la función del servicio para obtener los municipios
      const municipiosResponse = await listMunicipios(estadoID);
      setMunicipios(municipiosResponse); // Guardar los municipios en el estado
      setMunicipiosDisabled(false); // Habilitar el Picker de municipios
    } catch (error) {
      console.error('Error al obtener municipios:', error);
    }
  }
  };

  return (
    <ScrollView horizontal pagingEnabled style={styles.container}>
      {/* Sección 1: Datos personales */}
      <View style={[styles.page, { width }]}>
        <StatusBar style="dark" />
        <Text style={styles.title}>Datos Personales</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre(s)"
            placeholderTextColor="#999"
            value={nombreCliente}
            onChangeText={setNombreCliente}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Apellido Paterno"
            placeholderTextColor="#999"
            value={apellidoPaterno}
            onChangeText={setApellidoPaterno}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Apellido Materno"
            placeholderTextColor="#999"
            value={apellidoMaterno}
            onChangeText={setApellidoMaterno}
          />
        </View>

        {/* Dropdown para Género */}
        <Text>Selecciona tu género:</Text>
        <RNPickerSelect
          onValueChange={(itemValue) => setSelectedGenero(itemValue)}
          items={generos.map((genero) => ({
            label: genero.nombreGenero,
            value: genero.generoID,
          }))}
          placeholder={{ label: 'Selecciona tu género', value: null }}
        />

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <TextInput
            style={styles.input}
            placeholder="Número Telefónico"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={contraseña}
            onChangeText={setContraseña}
          />
        </View>


        <TouchableOpacity onPress={seleccionarImagen} style={styles.button}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {imagen && (
          <Image source={{ uri: imagen }} style={styles.imagenPreview} />
        )}
      </View>

      {/* Sección 2: Dirección e Imagen */}
      <View style={[styles.page, { width }]}>
        <Text style={styles.title}>Dirección e Imagen</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código Postal"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={codigoPostal}
            onChangeText={setCodigoPostal}
          />
        </View>

        {/* Dropdown para Estado */}
        <Text>Selecciona tu estado:</Text>
        <RNPickerSelect
          onValueChange={(itemValue) => {
            setSelectedEstado(itemValue);
            obtenerMunicipios(itemValue); // Obtener municipios cuando se selecciona un estado
          }}
          items={estados.map((estado) => ({
            label: estado.nombreEstado,
            value: estado.estadoID,
          }))}
          placeholder={{ label: 'Selecciona tu estado', value: null }}
        />

        {/* Dropdown para Municipio */}
        <Text>Selecciona tu municipio:</Text>
        <RNPickerSelect
          onValueChange={(itemValue) => setSelectedMunicipio(itemValue)}
          items={municipios.map((municipio) => ({
            label: municipio.nombreMunicipio,
            value: municipio.municipioID,
          }))}
          placeholder={{ label: 'Selecciona tu municipio', value: null }}
          disabled={municipiosDisabled} // Deshabilitar si no hay estado seleccionado
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Colonia"
            placeholderTextColor="#999"
            value={colonia}
            onChangeText={setColonia}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Calle"
            placeholderTextColor="#999"
            value={calle}
            onChangeText={setCalle}
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <TextInput
            style={styles.input}
            placeholder="NO. Int"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={noInt}
            onChangeText={setNoInt}
          />
        </View>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <TextInput
            style={styles.input}
            placeholder="NO. Ext"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={noExt}
            onChangeText={setNoExt}
          />
        </View>


        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#0c4a6e' : undefined}
          />
          <Text style={styles.checkboxLabel}>
            Estoy de acuerdo con los <Text style={styles.link}>Términos y condiciones</Text> y con la <Text style={styles.link}>Política de privacidad</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
