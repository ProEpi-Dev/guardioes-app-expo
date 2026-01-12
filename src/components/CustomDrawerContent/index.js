import React from 'react';
import { View, Text, Share, Linking, TouchableOpacity, Alert } from 'react-native';
import { 
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { styles } from './styles';
import translate from '../../locales/i18n';
import { useAuth } from '../../contexts/AuthContext';

const onShare = async () => {
  try {
    const shareOptions = {
      message: translate('drawer.shareLink'),
      title: translate('drawer.share'), 
    };
    await Share.share(shareOptions);

  } catch (error) {
    Alert.alert(error.message);
  }
};

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const { logout } = useAuth();

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
            // A navegação será gerenciada automaticamente pelo RootNavigator
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
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
          label={translate('drawer.logout')}
          icon={({ size }) => (
            <Feather name="log-out" size={size} color={'white'} />
          )}
          onPress={handleLogout}
          style={styles.drawerItemBlue}
          labelStyle={styles.drawerLabel}
        />
      </View>

      <View style={styles.titleSection}>
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
      />
    </DrawerContentScrollView>
  );
}
