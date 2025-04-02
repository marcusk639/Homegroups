import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import HomegroupMainScreen from '../screens/homegroup/HomegroupMainScreen';

// Define the param types for navigation
type HomeStackParamList = {
  Home: undefined;
  HomeGroup: {groupId: string};
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeGroupNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HomeGroup" component={HomegroupMainScreen} />
    </Stack.Navigator>
  );
};

export default HomeGroupNavigator;
