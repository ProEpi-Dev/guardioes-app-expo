import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import DrawerNavigator from './DrawerNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Register } from '../screens/auth/Register';
import { RootStackParamList } from '../types/auth';
import { FinishProfile } from '../screens/auth/FinishProfile';
import { PasswordRecover } from '../screens/auth/PasswordRecover';
import { EmailConfirmation } from '../screens/auth/EmailConfirmation';
import { Vbe } from '../screens/app/Vbe/ReportScreen';
import { SituationScreen } from '../screens/app/Vbe/SituationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="Welcome" component={Welcome} /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PasswordRecover" component={PasswordRecover} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FinishProfile" component={FinishProfile} />
      <Stack.Screen name="Home" component={DrawerNavigator} />
      <Stack.Screen name="EmailConfirmation" component={EmailConfirmation} />
      <Stack.Screen name="Vbe" component={Vbe} />
      <Stack.Screen name="Situation" component={SituationScreen} />
    </Stack.Navigator>
  );
}
