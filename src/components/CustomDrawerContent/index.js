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
          label={translate('drawer.profiles')}
          icon={({ size }) => (
            <Feather name="settings" size={size} color={'white'} />
          )}
          onPress={() => navigation.navigate(translate('drawer.profiles'))}
          style={styles.drawerItemBlue}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Alterar Senha"
          icon={({ size }) => (
            <Feather name="key" size={size} color={'white'} />
          )}
          onPress={() => navigation.navigate('Alterar Senha')}
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
        label={translate('drawer.toSurveillance')}
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
        label={translate('drawer.toVaccination')}
        icon={({ size }) => (
          <FontAwesome5 name="syringe" size={size} color="white" />
        )}
        onPress={() => navigation.navigate('Vacinação')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label={translate('drawer.toHelp')}
        icon={({ size }) => (
          <Feather name="help-circle" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Ajuda')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

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
        label="Como você se sente?"
        icon={({ size }) => (
          <Feather name="heart" size={size} color={'white'} />
        )}
        onPress={() => navigation.navigate('Mapa Sentimento')}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label={translate('drawer.share')}
        icon={({ size }) => (
          <Feather name="share-2" size={size} color={'white'} />
        )}
        onPress={onShare}
        style={styles.drawerItemGreen}
        labelStyle={styles.drawerLabel}
      />

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.redeSocial}
          onPress={() => Linking.openURL('https://twitter.com/proepi_')}
        >
          <FontAwesome6 name="x-twitter" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.redeSocial}
          onPress={() => Linking.openURL('https://www.instagram.com/redeproepi')}
        >
          <FontAwesome5 name="instagram" size={24} color='white' />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
