import React, { useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from '../../assets/styles/Pp&TcStyles';

const TermsAndConditionsScreen = () => {
    const [loading, setLoading] = useState(true);

    // Enlace directo al PDF en Google Drive
    const pdfUrl = 'https://drive.google.com/file/d/1hypERbFVrWr-pbbpsKdSWsww1JmltiI3/preview';


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




export default TermsAndConditionsScreen;
