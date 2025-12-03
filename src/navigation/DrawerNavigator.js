import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { ClusterMap } from '../screens/app/ClusterMap';
import { MapaSentimento } from '../screens/app/MapaSentimento';
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
        headerTintColor: '#000'
      }}
      
    >
      <Drawer.Screen 
        name="Inicio" 
        component={MapaSentimento} 
      />
      <Drawer.Screen 
        name="Cluster" 
        component={ClusterMap} 
        options={{
          headerTitle: translate('drawer.cluster'),
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
