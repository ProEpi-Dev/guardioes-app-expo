import React from 'react';
import { View, Text } from 'react-native';
import { 
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles'; // Importa os estilos do arquivo ao lado

export default function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Início"
        icon={({ size }) => (
          <Feather name="home" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Inicio')}
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
