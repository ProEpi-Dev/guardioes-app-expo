import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapaSentimento } from '../screens/app/MapaSentimento';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardStack from './CardStack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();

export function BottomNavigation() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#348eac',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
           height: 70,
           paddingTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={MapaSentimento}
        options={{ 
            tabBarLabel: 'Início',
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerLeft: () => (
                <TouchableOpacity 
                    onPress={() => navigation.openDrawer()} 
                    style={{ marginLeft: 15, marginTop: 10 }}
                >
                    <MaterialCommunityIcons name="menu" size={30} color="black" />
                </TouchableOpacity>
            ),
            tabBarIcon: () => (
                <MaterialCommunityIcons name="home" size={24} color="black" />
            ),
         }}
      />

      <Tab.Screen 
        name="Artigos"
        component={CardStack}
        options={{ 
            tabBarLabel: 'Artigos',
            tabBarIcon: () => (
                <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}