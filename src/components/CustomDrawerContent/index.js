import React from 'react';
import { View, Text, Alert } from 'react-native';
import { 
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';
import translate from '../../locales/i18n';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      translate('drawer.logout') || 'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoSection}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={30} color="#348eac" />
        </View>
        <Text style={styles.userName}>
          Olá, {user?.name || 'Usuário'} 
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.header}>
        <DrawerItem
          label="Início"
          icon={({ size }) => (
            <Feather name="home" size={size} color={'white'} />
          )}
          onPress={() => navigation.navigate('Inicio')}
          style={styles.drawerItemBlue}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Perfil"
          icon={({ size }) => (
            <Feather name="user" size={size} color={'white'} />
          )}
          onPress={() => navigation.navigate('Perfil')}
          style={styles.drawerItemBlue}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Sair"
          icon={({ size }) => (
            <Feather name="log-out" size={size} color={'white'} />
          )}
          onPress={handleLogout}
          style={styles.drawerItemGreen}
          labelStyle={styles.drawerLabel}
        />
      </View>

      {/* <View style={styles.titleSection}>
        <Text style={styles.titleText}>{translate('drawer.app')}</Text>
      </View>

      <DrawerItem
        label={translate('drawer.cluster')}
        icon={({ size }) => (
          <Feather name="map" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Cluster')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem 
        label="Quizz"
        icon={({size}) => (
          <Feather name="book" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Quizz')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      /> */}
    </DrawerContentScrollView>
  );
}
