import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../utils/colors";

interface CustomHeaderProps {
  userName: string | undefined;
}

export const CustomHeader = ({ userName }: CustomHeaderProps) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  
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
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather name="menu" size={28} color="white" />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
        <Image source={require('../../../assets/icone_g_branca.png')} style={{ width: 50, height: 55 }} />
        <Text style={{ color: 'white', marginLeft: 15, fontSize: 17 }}>Olá, {userName}!</Text>
      </View>
    </LinearGradient>
  );
};