import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Define the type for your navigation stack parameters
type RootStackParamList = {
  Home: undefined;
  HomeGroup: {groupId: string};
  // Add other screens here as needed
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

// Types for home screen data
interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  createdBy: string;
}

interface Meeting {
  id: string;
  name: string;
  dayOfWeek: string;
  time: string;
  location: string;
  format: string;
}

interface Celebration {
  id: string;
  memberName: string;
  years: number;
  celebrationDate: Date;
}

interface HomeGroup {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  memberCount: number;
  isAdmin: boolean;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [homeGroups, setHomeGroups] = useState<HomeGroup[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get current user's display name
    const currentUser = auth().currentUser;
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    }

    // Load initial data
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, these would be actual Firestore queries
      // For MVP, we'll use mock data

      // Fetch announcements
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Business Meeting This Sunday',
          message:
            'Please join us for our monthly business meeting after the regular meeting this Sunday.',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
          createdBy: 'J',
        },
        {
          id: '2',
          title: 'New Meeting Format',
          message:
            'Starting next week, we will be using a new meeting format that includes a 15-minute meditation.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          createdBy: 'M',
        },
      ];
      setAnnouncements(mockAnnouncements);

      // Fetch upcoming meetings
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          name: 'Morning Serenity',
          dayOfWeek: 'Today',
          time: '7:30 AM',
          location: 'Community Center, Room 101',
          format: 'Open Discussion',
        },
        {
          id: '2',
          name: 'Noon Recovery',
          dayOfWeek: 'Today',
          time: '12:00 PM',
          location: 'Main Street Church Basement',
          format: 'Speaker',
        },
        {
          id: '3',
          name: 'Evening Meditation',
          dayOfWeek: 'Tomorrow',
          time: '7:00 PM',
          location: 'Hope Center',
          format: 'Meditation & Discussion',
        },
      ];
      setUpcomingMeetings(mockMeetings);

      // Fetch celebrations
      const mockCelebrations: Celebration[] = [
        {
          id: '1',
          memberName: 'T',
          years: 1,
          celebrationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        {
          id: '2',
          memberName: 'S',
          years: 5,
          celebrationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
      ];
      setCelebrations(mockCelebrations);

      // Fetch homegroups
      const mockHomeGroups: HomeGroup[] = [
        {
          id: 'group1',
          name: 'Serenity Now Group',
          description:
            'A welcoming group focused on practical application of the principles.',
          meetingDay: 'Tuesday',
          meetingTime: '7:00 PM',
          memberCount: 35,
          isAdmin: true,
        },
        {
          id: 'group2',
          name: 'Recovery Warriors',
          description: 'A solution-focused homegroup with rotating speakers.',
          meetingDay: 'Friday',
          meetingTime: '8:00 PM',
          memberCount: 42,
          isAdmin: false,
        },
        {
          id: 'group3',
          name: 'Hope and Healing',
          description: 'Focused on the spiritual aspects of recovery.',
          meetingDay: 'Sunday',
          meetingTime: '10:00 AM',
          memberCount: 28,
          isAdmin: false,
        },
      ];
      setHomeGroups(mockHomeGroups);
    } catch (error) {
      console.error('Error loading home data:', error);
      Alert.alert('Error', 'Failed to load home data. Please try again later.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const navigateToHomeGroup = (groupId: string) => {
    navigation.navigate('HomeGroup', {groupId});
  };

  const renderHomeGroupItem = ({item}: {item: HomeGroup}) => (
    <TouchableOpacity
      style={styles.homeGroupCard}
      onPress={() => navigateToHomeGroup(item.id)}>
      <View style={styles.homeGroupHeader}>
        <Text style={styles.homeGroupName}>{item.name}</Text>
        {item.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>
      <Text style={styles.homeGroupDescription}>{item.description}</Text>
      <View style={styles.homeGroupFooter}>
        <Text style={styles.homeGroupMeetingTime}>
          {item.meetingDay}s at {item.meetingTime}
        </Text>
        <Text style={styles.homeGroupMemberCount}>
          {item.memberCount} members
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, {userName || 'Friend'}</Text>
          <Text style={styles.subtitleText}>
            Your recovery journey continues
          </Text>
        </View>

        {/* Home Groups Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Home Groups</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Join Group',
                  'This feature will allow you to join new groups.',
                )
              }>
              <Text style={styles.seeAllText}>Join New</Text>
            </TouchableOpacity>
          </View>

          {homeGroups.length > 0 ? (
            <FlatList
              data={homeGroups}
              renderItem={renderHomeGroupItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.homeGroupsList}
            />
          ) : (
            <View style={styles.emptyHomeGroups}>
              <Text style={styles.emptyStateText}>
                You haven't joined any home groups yet
              </Text>
              <TouchableOpacity
                style={styles.joinGroupButton}
                onPress={() =>
                  Alert.alert(
                    'Join Group',
                    'This feature will allow you to join new groups.',
                  )
                }>
                <Text style={styles.joinGroupButtonText}>Find a Group</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Upcoming Meetings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map(meeting => (
              <TouchableOpacity key={meeting.id} style={styles.meetingCard}>
                <View style={styles.meetingTimeContainer}>
                  <Text style={styles.meetingDay}>{meeting.dayOfWeek}</Text>
                  <Text style={styles.meetingTime}>{meeting.time}</Text>
                </View>
                <View style={styles.meetingInfoContainer}>
                  <Text style={styles.meetingName}>{meeting.name}</Text>
                  <Text style={styles.meetingLocation}>{meeting.location}</Text>
                  <Text style={styles.meetingFormat}>{meeting.format}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No upcoming meetings</Text>
          )}
        </View>

        {/* Announcements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {announcements.length > 0 ? (
            announcements.map(announcement => (
              <View key={announcement.id} style={styles.announcementCard}>
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <Text style={styles.announcementDate}>
                    {formatDate(announcement.createdAt)}
                  </Text>
                </View>
                <Text style={styles.announcementMessage}>
                  {announcement.message}
                </Text>
                <Text style={styles.announcementAuthor}>
                  Posted by {announcement.createdBy}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No announcements</Text>
          )}
        </View>

        {/* Celebrations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Celebrations</Text>
          </View>

          {celebrations.length > 0 ? (
            celebrations.map(celebration => (
              <View key={celebration.id} style={styles.celebrationCard}>
                <View style={styles.celebrationIcon}>
                  <Text style={styles.celebrationIconText}>🎉</Text>
                </View>
                <View style={styles.celebrationInfo}>
                  <Text style={styles.celebrationName}>
                    {celebration.memberName} - {celebration.years}{' '}
                    {celebration.years === 1 ? 'Year' : 'Years'}
                  </Text>
                  <Text style={styles.celebrationDate}>
                    {formatDate(celebration.celebrationDate)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No upcoming celebrations</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#2196F3',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
  },
  homeGroupsList: {
    paddingBottom: 8,
  },
  homeGroupCard: {
    width: 240,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  homeGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeGroupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  adminBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196F3',
  },
  homeGroupDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    flex: 1,
  },
  homeGroupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeGroupMeetingTime: {
    fontSize: 12,
    color: '#616161',
  },
  homeGroupMemberCount: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  emptyHomeGroups: {
    padding: 24,
    alignItems: 'center',
  },
  joinGroupButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  joinGroupButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  meetingCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
  },
  meetingTimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    minWidth: 80,
  },
  meetingDay: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  meetingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  meetingInfoContainer: {
    flex: 1,
    paddingLeft: 16,
  },
  meetingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  meetingLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  meetingFormat: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  announcementCard: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  announcementDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  announcementAuthor: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'right',
  },
  celebrationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  celebrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  celebrationIconText: {
    fontSize: 20,
  },
  celebrationInfo: {
    flex: 1,
  },
  celebrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  celebrationDate: {
    fontSize: 14,
    color: '#757575',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default HomeScreen;
