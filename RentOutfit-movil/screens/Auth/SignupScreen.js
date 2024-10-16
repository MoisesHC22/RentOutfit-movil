import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { validateEmail } from '../../components/Validaciones/validateEmail'; // Importar la función de validación
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import styles from '../../assets/styles/SignUpStyle';

export default function SignupScreen({navigation}) {
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState(''); // Estado para el correo electrónico


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre(s)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Apellido Paterno"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Apellido Materno"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={setEmail} // Actualizar el estado del correo electrónico
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="Código Postal"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="Municipio/Alcaldía"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Colonia"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Calle"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="Número Telefónico"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="NO. Int"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <TextInput
              style={styles.input}
              placeholder="NO. Ext"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#0c4a6e' : undefined}
          />
          <Text style={styles.checkboxLabel}>
            Estoy de acuerdo con los <Text style={styles.link}>Términos y condiciones</Text> y con los <Text style={styles.link}>Política de privacidad</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (validateEmail(email)) {
              // Lógica para crear la cuenta
              alert('Cuenta creada exitosamente');
            }
          }}
        >
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginLink}>Ya tengo cuenta?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}