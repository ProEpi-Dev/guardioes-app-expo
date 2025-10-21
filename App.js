import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Welcome from './src/screens/auth/Welcome'
import Login from './src/screens/auth/Login'
import Home from './src/screens/Home'
import CameraScreen from './src/screens/cameraScreen/cameraScreen'
import ScreenLoader from './src/components/ScreenLoader'

const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula um tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <ScreenLoader />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}