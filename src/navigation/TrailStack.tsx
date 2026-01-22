import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTrailParamList } from '../types/trail';
import TrailCard from '../screens/app/trail/TrailCard';
import TrailContent from '../screens/app/trail/TrailContent';
import ArticleScreen from '../screens/app/ArticleScreen'; 

const Stack = createNativeStackNavigator<RootTrailParamList>();

export default function TrailStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={TrailCard} 
                options={{ title: 'Trilhas' }}
            />

            <Stack.Screen
                name="Accordion"
                component={TrailContent}
                options={({ route }) => {
                    const trail = route.params.trail;
                    const trailName = Array.isArray(trail) ? trail[0]?.name : trail?.name;
                    return { title: trailName || 'Detalhes da Trilha' };
                }}
            />

            <Stack.Screen
                name="Article"
                component={ArticleScreen as any}
                options={({ route }) => ({ 
                    title: route.params.article?.title || 'Artigo'
                })}
            />
        </Stack.Navigator>
    );
}