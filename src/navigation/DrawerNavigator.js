import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import Home from '../screens/Home';
import { Quizzes } from '../screens/app/Quizzes';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Vigilancia } from '../screens/app/Vigilancia';
import { Vacinacao } from '../screens/app/Vacinacao';
import { Ajuda } from '../screens/app/Ajuda';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: '',
        headerTransparent: true,
        drawerType: 'front',
        headerTintColor: '#fff'
      }}
      
    >
      <Drawer.Screen 
        name="Inicio" 
        component={Home} 
      />
      <Drawer.Screen 
        name="Vigilância Ativa" 
        component={Vigilancia} 
        options={{
          headerTitle: 'Vigilância Ativa',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#348eac',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
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
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
      <Drawer.Screen 
        name="Vacinação" 
        component={Vacinacao} 
        options={{
          headerTitle: 'Vacinação',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#348eac',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
      <Drawer.Screen 
        name="Ajuda" 
        component={Ajuda} 
        options={{
          headerTitle: 'Ajuda',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#348eac',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
      <Drawer.Screen 
        name="Compartilhar" 
        component={Ajuda} 
        options={{
          headerTitle: 'Compartilhar',
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: '#348eac',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
    </Drawer.Navigator>
  );
}
