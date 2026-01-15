import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Quizz } from '../screens/app/QuizzCardScreen';
import { QuizzInfoScreen } from '../screens/app/QuizInfoScreen';
import { QuizStackParamList } from '../types/quizz';
import  ArticleScreen  from '../screens/app/ArticleScreen'
import { QuizzQuestionsScreen } from '../screens/app/QuizQuestionsScreen';

const Stack = createNativeStackNavigator<QuizStackParamList>();

export default function QuizStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="Home"
            component={Quizz}
            options={{
                headerTitle: '',
                headerTransparent: true,
            }}
            />

            <Stack.Screen
            name="QuizzInfoScreen"
            component={QuizzInfoScreen}
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
                component={QuizzQuestionsScreen} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}