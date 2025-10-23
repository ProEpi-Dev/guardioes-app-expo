import React from 'react';
import { View, Text } from 'react-native';
import { 
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { styles } from './styles';

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
        style={styles.drawerItemBlue}
        labelStyle={styles.drawerLabel}
      />

      <View style={styles.titleSection}>
        <Text style={styles.titleText}>Aplicativo</Text>
      </View>

      <DrawerItem
        label="Vigilância Ativa"
        icon={({ size }) => (
          <Feather name="shield" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Vigilância Ativa')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Quiz"
        icon={({ size }) => (
          <Feather name="book" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Quiz')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Vacinação"
        icon={({ size }) => (
          <FontAwesome5 name="syringe" size={size} color="white" />
        )}
        onPress={() => navigation.navigate('Vacinação')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Ajuda"
        icon={({ size }) => (
          <Feather name="help-circle" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Ajuda')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Compartilhar"
        icon={({ size }) => (
          <Feather name="share-2" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Ajuda')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />
    </DrawerContentScrollView>
  );
}
