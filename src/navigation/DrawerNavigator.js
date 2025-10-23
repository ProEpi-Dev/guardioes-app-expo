import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';
import Home from '../screens/Home';
import { Quizzes } from '../screens/app/Quizzes';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
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
    </Drawer.Navigator>
  );
}
