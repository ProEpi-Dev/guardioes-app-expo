import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/auth/ProfileScreen';
import { ProfileStackParamList } from '../types/profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Home" 
            component={ProfileScreen} 
            options={{
                headerTitle: '',
                headerTransparent: true,
            }}
            />
        </Stack.Navigator>
    );
}