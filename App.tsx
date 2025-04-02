import React, {useState, useEffect} from 'react';
import {StatusBar, SafeAreaView, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LandingScreen from './src/screens/auth/LandingScreen';

// Placeholder for main app screens
const HomeScreen = () => (
  <SafeAreaView
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Home Screen</Text>
  </SafeAreaView>
);

const MeetingsScreen = () => (
  <SafeAreaView
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Meetings Screen</Text>
  </SafeAreaView>
);

const ProfileScreen = () => (
  <SafeAreaView
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Profile Screen</Text>
  </SafeAreaView>
);

// Define the param types for our navigation stacks
type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Meetings: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

// Create the navigation stacks
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Auth navigation stack
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Landing" component={LandingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main app navigation (tabs)
const MainNavigator = () => {
  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // Add icons here in the future
        }}
      />
      <MainTab.Screen
        name="Meetings"
        component={MeetingsScreen}
        options={{
          tabBarLabel: 'Meetings',
          // Add icons here in the future
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // Add icons here in the future
        }}
      />
    </MainTab.Navigator>
  );
};

const App = () => {
  // Set up initial state
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setIsAuthenticated(!!user);
        setIsLoading(false);
      },
    );

    // Clean up the auth listener
    return unsubscribe;
  }, []);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen navigation={{replace: () => {}}} />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
