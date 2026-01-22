import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTrailParamList } from '../types/trail';
import TrailCard from '../screens/app/trail/TrailCard';

const Stack = createNativeStackNavigator<RootTrailParamList>();

export default function TrailStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Home" 
            component={TrailCard} 
            options={{ title: 'Trilhas' }}
            />
        </Stack.Navigator>
    );
}