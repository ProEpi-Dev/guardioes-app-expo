import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Quiz } from '../screens/app/QuizzCardScreen';
import { QuizInfoScreen } from '../screens/app/QuizInfoScreen';
import { QuizStackParamList } from '../types/quiz';
import  ArticleScreen  from '../screens/app/ArticleScreen'
import { QuizQuestionsScreen } from '../screens/app/QuizQuestionsScreen';
import { QuizResultScreen } from '../screens/app/QuizResultScreen';

const Stack = createNativeStackNavigator<QuizStackParamList>();

export default function QuizStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="Home"
            component={Quiz}
            options={{
                headerTitle: '',
                headerTransparent: true,
            }}
            />

            <Stack.Screen
            name="QuizzInfoScreen"
            component={QuizInfoScreen}
            options={({ route }) => ({
                title: route.params.title,
                headerShown: true,
                headerBackTitleVisible: false,
                headerTintColor: '#000',
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#F5F5F5' },
                headerShadowVisible: false,
            })}
            />

            <Stack.Screen 
            name="Article" 
            component={ArticleScreen} 
            options={{ title: 'Material de Estudo' }} 
            />

            <Stack.Screen 
            name="QuizzQuestionsScreen" 
            component={QuizQuestionsScreen} 
            options={{ headerShown: false }}
            />

            <Stack.Screen 
            name="QuizResultScreen" 
            component={QuizResultScreen} 
            options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    )
}