import { StatusBar, Text, StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Styles'

const verde = '#77bfad'
const azul = '#2E97BE'

const Home = ({ navigation, route }) => {
    const photoUri = route.params?.photoUri;

    const handleLogout = () => {
        navigation.navigate('Welcome');
    };

    const handleOpenCamera = () => {
        navigation.navigate('Camera');
    };

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: azul }} />
            <StatusBar backgroundColor={verde} barStyle='light-content' />

            <LinearGradient
                colors={[azul, verde]}
                style={styles.header}
            >

                <Text style={styles.welcomeText}>
                    Bem-vindo ao Guardiões da Saúde!
                </Text>

                <View style={styles.photoContainer}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.photo} />
                    ) : (
                        <Text style={styles.placeholderText}>Sua foto aparecerá aqui!</Text>
                    )}
                </View>
                
                <TouchableOpacity style={styles.snowButton} onPress={handleOpenCamera}>
                    <Text style={styles.label}>Tirar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.snowButton} onPress={handleLogout}>
                    <Text style={styles.label}>Sair</Text>
                </TouchableOpacity>
            </LinearGradient>   
        </>
    );
};

export default Home;

