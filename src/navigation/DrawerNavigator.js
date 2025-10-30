import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import Home from '../screens/Home';
import { Quizzes } from '../screens/app/Quizzes';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Vigilancia } from '../screens/app/Vigilancia';
import { Vacinacao } from '../screens/app/Vacinacao';
import { Ajuda } from '../screens/app/Ajuda';
import { PerfilEditar } from '../screens/app/PerfilEditar'
import { ContaSenha } from '../screens/app/ContaSenha'
import translate from '../locales/i18n';

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
        name={translate('drawer.profiles')}
        component={PerfilEditar}
        options={{
          headerTitle: translate('drawer.profiles'),
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
        name="Alterar Senha"
        component={ContaSenha}
        options={{
          headerTitle: 'Alterar Senha',
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
    </Drawer.Navigator>
  );
}
