import React from 'react'
import { SafeAreaView, ActivityIndicator, View, Image, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Screen } from './styles'
import { scale } from '../../utils/scalling'

const ScreenLoader = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#348EAC' }}>
            <LinearGradient
                colors={['#5DD39E', '#348EAC']}
                style={{ flex: 1 }}
            >
                <Screen>
                    {/* Logo GDS */}
                    <Image 
                        source={require('../../../assets/gds_splash.png')}
                        style={{
                            width: scale(265),
                            height: scale(265),
                            marginBottom: scale(40),
                            resizeMode: 'contain'
                        }}
                    />
                    
                    {/* Loading text */}
                    <Text style={{
                        color: '#ffffff',
                        fontSize: scale(16),
                        marginBottom: scale(20),
                        fontFamily: 'System',
                        fontWeight: '500'
                    }}>
                        Carregando...
                    </Text>
                    
                    {/* Loading spinner */}
                    <View style={{
                        width: scale(72),
                        height: scale(72),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f4f4f4',
                        borderRadius: scale(36),
                    }}>
                        <ActivityIndicator 
                            size="large" 
                            color="#348EAC" 
                        />
                    </View>
                </Screen>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default ScreenLoader
