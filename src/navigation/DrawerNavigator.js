import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { ClusterMap } from '../screens/app/ClusterMap';
import { BottomNavigation } from './BottomNavigator'
import QuizStack from './QuizStack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        headerTransparent: true,
        drawerType: 'front',
        headerTintColor: '#000'
      }}
      
    >
      <Drawer.Screen 
        name="Inicio" 
        component={BottomNavigation}
      />
      <Drawer.Screen 
        name="Cluster" 
        component={ClusterMap} 
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
      
      <Drawer.Screen 
        name="Quizz" 
        component={QuizStack} 
        options={({ route }) => {
          // Pega o nome da rota atual dentro do Stack (ex: 'Home', 'QuizzIntroScreen')
          // Se for undefined, assume que é a primeira tela ('Home')
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

          // Lógica: Só mostra o Header do Drawer se estivermos na 'Home'
          const shouldShowHeader = routeName === 'Home';

          return {
            headerTitle: 'Quizzes',
            headerShown: shouldShowHeader, // Dinâmico: true na lista, false na intro
            headerTitleAlign: 'center',
            headerRight: () => <View />,
            // Se estiver na Home, mantém transparente conforme seu design original
            // Se quiser fundo branco, remova o headerTransparent ou controle aqui também
             headerTransparent: true, 
          };
        }}
      />
    </Drawer.Navigator>
  );
}
