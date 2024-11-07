import React, { useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../assets/styles/Pp&TcStyles';

const PrivacyPolicyScreen = () => {
  const [loading, setLoading] = useState(true);

  // Enlace directo al PDF en Google Drive
  const pdfUrl = 'https://drive.google.com/file/d/1AAV_i1FkIlpoIyeQW0eZIs1Pu1aUmw0X/preview';

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        source={{ uri: pdfUrl }} 
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onError={() => Alert.alert('Error', 'No se pudo cargar el documento.')}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};



export default PrivacyPolicyScreen;
