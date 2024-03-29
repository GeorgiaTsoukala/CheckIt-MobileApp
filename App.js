import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import VisualizationsScreen from './screens/VisualizationsScreen';
import BottomNavigation from './bottomNavigation'
import CategoriesScreen from './screens/get_started/CategoriesScreen'
import IconScreen from './screens/get_started/IconScreen'
import GoalsScreen from './screens/get_started/GoalsScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Categories" component={CategoriesScreen}/>
        {/* <Stack.Screen name="IconGetStarted" component={IconScreen}/> */}
        <Stack.Screen name="Goals" component={GoalsScreen}/>       
        <Stack.Screen name="BottomNavigation" component={BottomNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
