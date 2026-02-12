import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapaSentimento } from '../screens/app/MapaSentimento';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CardStack from './CardStack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import TrailStack from './TrailStack';
import { colors } from '../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export function BottomNavigation() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secundaria, 
        tabBarInactiveTintColor: '#999', 
        tabBarStyle: {
           height: 60 + insets.bottom, 
           paddingTop: 8,
           paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
           borderTopLeftRadius: 25,
           borderTopRightRadius: 25,
           backgroundColor: '#FFF',
           borderTopWidth: 0,
           elevation: 0,
           shadowColor: 'transparent',
           shadowOffset: { width: 0, height: -2 },
           shadowOpacity: 0.1,
           shadowRadius: 4,
           position: 'absolute',
           paddingHorizontal: '5%'
        },
        tabBarItemStyle: {
          maxWidth: 200,
          alignSelf: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={MapaSentimento}
        options={{ 
            tabBarLabel: 'Início',
            headerShown: false,
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
            tabBarIcon: ({ focused, color }) => (
                <Feather
                    name={"home"} 
                    size={24} 
                    color={color} 
                />
            ),
         }}
      />

      <Tab.Screen 
        name="Trilha"
        component={TrailStack}
        options={{ 
            tabBarLabel: 'Aprenda',
            tabBarIcon: ({ focused, color }) => (
                <MaterialCommunityIcons 
                    name={"chat-question-outline"} 
                    size={24} 
                    color={color} 
                />
            ),
            title: 'Trilhas'
        }}
      />

      <Tab.Screen 
        name="Artigos"
        component={CardStack}
        options={{ 
            tabBarLabel: 'Conteúdos',
            tabBarIcon: ({ focused, color }) => (
                <MaterialCommunityIcons 
                    name={"file-document-multiple-outline"} 
                    size={24} 
                    color={color} 
                />
            ),
        }}
      />
    </Tab.Navigator>
  );
}