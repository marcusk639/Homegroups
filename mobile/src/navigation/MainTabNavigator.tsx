import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import MeetingsScreen from '../screens/meetings/MeetingScreen';
import TreasuryScreen from '../screens/treasury/TreasuryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HomeGroupNavigator from './HomegroupNavigator';

// Import icons (would use a library like react-native-vector-icons in a real app)
// For simplicity, we're using Text components as placeholders
const HomeIcon = ({focused}: {focused: boolean}) => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#E3F2FD' : 'transparent',
      borderRadius: 12,
    }}>
    <Text
      style={{
        fontSize: 16,
        color: focused ? '#2196F3' : '#9E9E9E',
      }}>
      🏠
    </Text>
  </View>
);

const MeetingsIcon = ({focused}: {focused: boolean}) => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#E3F2FD' : 'transparent',
      borderRadius: 12,
    }}>
    <Text
      style={{
        fontSize: 16,
        color: focused ? '#2196F3' : '#9E9E9E',
      }}>
      📅
    </Text>
  </View>
);

const TreasuryIcon = ({focused}: {focused: boolean}) => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#E3F2FD' : 'transparent',
      borderRadius: 12,
    }}>
    <Text
      style={{
        fontSize: 16,
        color: focused ? '#2196F3' : '#9E9E9E',
      }}>
      💰
    </Text>
  </View>
);

const ProfileIcon = ({focused}: {focused: boolean}) => (
  <View
    style={{
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#E3F2FD' : 'transparent',
      borderRadius: 12,
    }}>
    <Text
      style={{
        fontSize: 16,
        color: focused ? '#2196F3' : '#9E9E9E',
      }}>
      👤
    </Text>
  </View>
);

// Define the param types for tab navigator
type MainTabParamList = {
  Home: undefined;
  Meetings: undefined;
  Treasury: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeGroupNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Meetings"
        component={MeetingsScreen}
        options={{
          tabBarLabel: 'Meetings',
          tabBarIcon: ({focused}) => <MeetingsIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Treasury"
        component={TreasuryScreen}
        options={{
          tabBarLabel: 'Treasury',
          tabBarIcon: ({focused}) => <TreasuryIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
