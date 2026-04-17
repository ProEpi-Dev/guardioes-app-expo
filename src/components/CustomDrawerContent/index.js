import React from 'react';
import { View, Text, Alert, TouchableOpacity, Linking } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { styles } from './styles';
import translate from '../../locales/i18n';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/colors';

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
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.userInfoSection}>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => navigation.closeDrawer()}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <View style={styles.header}>
        <View style={styles.botao}>
          <TouchableOpacity
            style={styles.actionButtonContainer}
            onPress={() => navigation.navigate('Inicio')}
          >
            <LinearGradient
              colors={[colors.azulClaro, colors.azulEscuro]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <FontAwesome5 name="home" size={24} color={'white'} />
              <Text style={styles.actionButtonText}>Início</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonContainer}
            onPress={() => navigation.navigate('Perfil')}
          >
            <LinearGradient
              colors={[colors.azulClaro, colors.azulEscuro]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <FontAwesome5 name="user-edit" size={24} color={'white'} />
              <Text style={styles.actionButtonText}>Perfil</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonContainer}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={[colors.azulClaro, colors.azulEscuro]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <Entypo name="log-out" size={24} color={'white'} />
              <Text style={styles.actionButtonText}>Sair</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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

      <View style={styles.socialContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.instagram.com/guardioesdasaudeunb/')
          }
        >
          <LinearGradient
            colors={[
              colors.gradientSocialLinkEscuro,
              colors.gradientSocialLinkClaro,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.redeSocial}
          >
            <Entypo name="instagram" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://x.com/guardioesunb')}
        >
          <LinearGradient
            colors={[
              colors.gradientSocialLinkEscuro,
              colors.gradientSocialLinkClaro,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.redeSocial}
          >
            <FontAwesome6 name="x-twitter" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
