import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { 
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import Welcome from './src/screens/auth/Welcome'
import Login from './src/screens/auth/Login'
import Home from './src/screens/Home'
import ScreenLoader from './src/components/ScreenLoader'
import { Quizzes } from './src/screens/app/Quizzes';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>

      <DrawerItem
        label="Início"
        icon={({ size }) => (
          <Feather name="home" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Home')}
        style={styles.drawerItemHome}
        labelStyle={styles.drawerLabel}
      />

      <View style={styles.titleSection}>
        <Text style={styles.titleText}>Aplicativo</Text>
      </View>

      <DrawerItem
        label="Quiz"
        icon={({ size }) => (
          <Feather name="book" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Quiz')}
        style={styles.drawerItemQuiz}
        labelStyle={styles.drawerLabel}
      />
      
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    
      screenOptions={{
        headerTitle: '',
        headerTransparent: true,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={Home} 
      />

      <Drawer.Screen 
        name="Quiz" 
        component={Quizzes} 
        options={{
          headerTitle: 'Quizzes',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#348eac',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
        <Stack.Screen name="Home" component={MyDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  drawerItemHome: {
    backgroundColor: '#003CB3',
    marginVertical: 30,
  },
  drawerItemQuiz: {
    backgroundColor: '#4bbd4bff',
    marginVertical: 30,
  },
  drawerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  }
});