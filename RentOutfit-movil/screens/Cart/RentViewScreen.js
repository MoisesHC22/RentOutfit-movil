import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const RentasScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [rentas, setRentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (user && user.token?.token) {
            const decodedToken = jwtDecode(user.token.token);
            setUserData(decodedToken);
        }
    }, [user]);

    const fetchRentas = async (date) => {
        setLoading(true);
        try {
            const [year, month, day] = date.split('-');
            const response = await fetch('https://rentoutfit-apis.onrender.com/Cliente/ListaDeRentas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioID: userData.usuario,
                    mes: parseInt(month),
                    ano: parseInt(year),
                    pagina: 0,
                }),
            });
        
            if (response.status === 200) {
                const data = await response.json();
        
                if (!data || data.length === 0) {
                    setRentas([]);
                    Alert.alert('Advertencia', 'No hay rentas disponibles para el mes seleccionado.');
                    return;
                }
        
                // Filtrar las rentas del día seleccionado
                const filteredRentas = data.filter((renta) => {
                    if (!renta.fechaPrestamo) {
                        console.error('Fecha de renta no definida en:', renta);
                        return false; // Ignora los elementos sin fecha de renta
                    }
                    
                    const [rentaYear, rentaMonth, rentaDay] = renta.fechaPrestamo.split('-');
                    return rentaDay === day; // Compara el día de la renta con el día seleccionado
                });
        
                if (filteredRentas.length > 0) {
                    setRentas(filteredRentas);
                    console.log('Rentas obtenidas:', filteredRentas);
                } else {
                    setRentas([]); // Limpia las rentas si no hay para el día seleccionado
                    Alert.alert('Información', 'No hay rentas en esta fecha.');
                }
            } else {
                setRentas([]);
                Alert.alert('Advertencia', 'No hay rentas disponibles para el mes seleccionado.');
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            Alert.alert('Error', 'Hubo un problema al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            console.log('selectedDate:', selectedDate);
            fetchRentas(selectedDate);
        }
    }, [selectedDate]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.imagen1 }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>{item.nombrePrenda}</Text>
                <Text style={styles.date}>Fecha de Renta: {item.fechaPrestamo}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#fff" />
                <Text style={styles.backButtonText}>Regresar</Text>
            </TouchableOpacity>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    onMonthChange={(month) => setSelectedDate(month.dateString)}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true, selectedColor: '#0180CB' },
                    }}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#0180CB',
                        selectedDayBackgroundColor: '#0180CB',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#0180CB',
                        dayTextColor: '#0180CB',
                        textDisabledColor: '#0180CB',
                        dotColor: '#0180CB',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#0180CB',
                        monthTextColor: '#0180CB',
                        indicatorColor: '#0180CB',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0180CB" />
                    <Text style={styles.loadingText}>Cargando rentas...</Text>
                </View>
            ) : rentas.length > 0 ? (
                <FlatList
                    data={rentas}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.detalleVentaID.toString()}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    <Icon name="calendar-blank" size={50} color="#999" />
                    <Text style={styles.noDataText}>No hay rentas para la fecha seleccionada.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0180CB',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    calendarContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: 10,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    list: {
        paddingTop: 10,
        paddingBottom: 20,
    },
});

export default RentasScreen;

