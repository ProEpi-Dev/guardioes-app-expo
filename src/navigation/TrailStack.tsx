import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTrailParamList } from '../types/trail';
import TrailCard from '../screens/app/trail/TrailCard';
import TrailContent from '../screens/app/trail/TrailContent';
import ArticleScreen from '../screens/app/ArticleScreen';
import { QuizInfoScreen } from '../screens/app/QuizInfoScreen';
import { QuizQuestionsScreen } from '../screens/app/QuizQuestionsScreen';
import { QuizResultScreen } from '../screens/app/QuizResultScreen';

const Stack = createNativeStackNavigator<RootTrailParamList>();

export default function TrailStack() {
    return (
        <Stack.Navigator>
            {/* ... Suas telas Home, Accordion, Article ... */}
            <Stack.Screen 
                name="Home" 
                component={TrailCard} 
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="Accordion"
                component={TrailContent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Article"
                component={ArticleScreen as any}
                options={{ headerShown: false }}
            />

            {/* --- ADICIONE AS TELAS DE QUIZ ABAIXO --- */}
            
            <Stack.Screen
                name="QuizzInfoScreen"
                component={QuizInfoScreen as any}
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
                name="QuizzQuestionsScreen" 
                component={QuizQuestionsScreen as any} 
                options={{ headerShown: false }}
            />

            <Stack.Screen 
                name="QuizResultScreen" 
                component={QuizResultScreen as any} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
}