import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArticleCardScreen from '../screens/app/ArticleCardScreen';
import ArticleScreen from '../screens/app/ArticleScreen';
import { RootStackParamList } from '../types/article';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function CardStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Home" 
            component={ArticleCardScreen} 
            options={{ title: 'Artigos' }}
            />

            <Stack.Screen 
            name="Article" 
            component={ArticleScreen}
            options={{ title: 'Artigo'}}
            />
        </Stack.Navigator>
    );
}