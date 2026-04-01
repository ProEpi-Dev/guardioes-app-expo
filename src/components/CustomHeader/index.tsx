import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../utils/colors";

interface CustomHeaderProps {
  userName: string | undefined;
  showBackButton?: boolean;
  showButton?: boolean;
  onBackPress?: () => void;
}

export const CustomHeader = ({ userName, showBackButton, showButton=true, onBackPress }: CustomHeaderProps) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const primeiroNome = userName?.trim().split(' ')[0] || "";
  
  return (
    <LinearGradient
      colors={[colors.principal, colors.secundaria]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 80 + insets.top,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: insets.top,
      }}
    >
      {/* Condição: Seta de voltar ou Menu hambúrguer */}
      {showButton && (
        <TouchableOpacity 
          style={{ zIndex: 10, padding: 5 }} 
          onPress={() => {
            if (showBackButton) {
                onBackPress ? onBackPress() : navigation.goBack();
            } else {
                navigation.openDrawer();
            }
          }}
        >
          <Feather name={showBackButton ? "arrow-left" : "menu"} size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* paddingRight compensa o tamanho do ícone à esquerda para manter o texto centralizado */}
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingRight: 38, paddingLeft: 15 }}>
        <Image source={require('../../../assets/icone_g_branca.png')} style={{ width: 50, height: 55 }} />
        <Text style={{ color: 'white', marginLeft: 15, fontSize: 17 }}>Olá, {primeiroNome}!</Text>
      </View>
    </LinearGradient>
  );
};