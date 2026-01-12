import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { ClusterMap } from '../screens/app/ClusterMap';
import { BottomNavigation } from './BottomNavigator'
import { Quizz } from '../screens/app/QuizzCardScreen'

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
        component={Quizz} 
        options={{
          headerTitle: 'Quizzes',
          headerShown: true,
          headerTitleAlign: 'center',
          headerRight: () => <View />,
        }}
      />
    </Drawer.Navigator>
  );
}
