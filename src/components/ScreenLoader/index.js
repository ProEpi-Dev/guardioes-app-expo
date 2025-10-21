import { ActivityIndicator, View, Image, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Screen,styles } from './styles'

const verde = '#77bfad'
const azul = '#2E97BE'

const ScreenLoader = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: azul }}>
            <LinearGradient
                colors={[azul, verde]}
                style={{ flex: 1 }}
            >
                <Screen>
                    {/* Logo GDS */}
                    <Image 
                        source={require('../../../assets/gds_splash.png')}
                        style={styles.img}
                    />
                    
                    {/* Loading text */}
                    <Text style={styles.loadingText}>
                        Carregando...
                    </Text>
                    
                    {/* Loading spinner */}
                    <View style={styles.loadingSpinner}>
                        <ActivityIndicator 
                            size="large" 
                            color="azul" 
                        />
                    </View>
                </Screen>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default ScreenLoader
