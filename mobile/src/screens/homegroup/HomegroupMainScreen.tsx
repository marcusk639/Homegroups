import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

// Types for HomeGroup data
interface HomeGroup {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  type: string;
  memberCount: number;
  foundedDate: string;
  isAdmin: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  sobrietyDate?: string;
  position?: string; // secretary, treasurer, etc.
  isAdmin: boolean;
}

interface SobrietyMilestone {
  memberId: string;
  memberName: string;
  years: number;
  date: Date;
}

interface GroupAnnouncement {
  id: string;
  title: string;
  content: string;
  date: Date;
  authorId: string;
  authorName: string;
  isPinned: boolean;
}

interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
}

interface TreasuryOverview {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  prudentReserve: number;
  lastUpdated: Date;
}

// Types for modals
type ModalType = 'announcement' | 'event' | null;

type RootStackParamList = {
  Home: undefined;
  HomeGroup: {groupId: string};
};

type MainTabParamList = {
  Home: undefined;
  Meetings: undefined;
  Treasury: undefined;
  Profile: undefined;
  Homegroup: {groupId: string};
};

type Props =
  | NativeStackScreenProps<RootStackParamList, 'HomeGroup'>
  | BottomTabScreenProps<MainTabParamList, 'Homegroup'>;

const HomegroupMainScreen = ({route, navigation}: Props) => {
  const {groupId} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'members' | 'literature'>(
    'home',
  );

  // Data states
  const [group, setGroup] = useState<HomeGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [milestones, setMilestones] = useState<SobrietyMilestone[]>([]);
  const [announcements, setAnnouncements] = useState<GroupAnnouncement[]>([]);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [treasuryOverview, setTreasuryOverview] =
    useState<TreasuryOverview | null>(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Form states for adding content
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventIsOnline, setNewEventIsOnline] = useState(false);
  const [newEventMeetingLink, setNewEventMeetingLink] = useState('');

  // Load group data
  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    setRefreshing(true);
    try {
      // In a real app, this would be Firestore queries
      // For MVP, we'll use mock data

      // Mock group data
      const mockGroup: HomeGroup = {
        id: groupId,
        name: 'Serenity Now Group',
        description:
          'A welcoming group focused on practical application of the principles. Meeting since 2010.',
        meetingDay: 'Tuesday',
        meetingTime: '7:00 PM',
        location: 'Community Center, Room 101, 123 Main St.',
        type: 'Open Discussion',
        memberCount: 35,
        foundedDate: '2010-05-15',
        isAdmin: true, // Current user is an admin
      };
      setGroup(mockGroup);

      // Mock members data
      const mockMembers: GroupMember[] = [
        {
          id: '1',
          name: 'J.',
          sobrietyDate: '2020-06-12',
          position: 'Secretary',
          isAdmin: true,
        },
        {
          id: '2',
          name: 'M.',
          sobrietyDate: '2015-03-22',
          position: 'Treasurer',
          isAdmin: true,
        },
        {
          id: '3',
          name: 'S.',
          sobrietyDate: '2019-11-05',
          position: 'GSR',
          isAdmin: true,
        },
        {
          id: '4',
          name: 'T.',
          sobrietyDate: '2023-09-01',
          isAdmin: false,
        },
        {
          id: '5',
          name: 'L.',
          sobrietyDate: '2018-04-30',
          isAdmin: false,
        },
      ];
      setMembers(mockMembers);

      // Mock upcoming sobriety milestones
      const mockMilestones: SobrietyMilestone[] = [
        {
          memberId: '4',
          memberName: 'T.',
          years: 1,
          date: new Date('2024-09-01'),
        },
        {
          memberId: '1',
          memberName: 'J.',
          years: 4,
          date: new Date('2024-06-12'),
        },
        {
          memberId: '3',
          memberName: 'S.',
          years: 5,
          date: new Date('2024-11-05'),
        },
      ];
      setMilestones(mockMilestones);

      // Mock announcements
      const mockAnnouncements: GroupAnnouncement[] = [
        {
          id: '1',
          title: 'Group Inventory',
          content:
            'We will be conducting our annual group inventory after the meeting on May 15th. All members are encouraged to attend and participate.',
          date: new Date('2024-04-30'),
          authorId: '1',
          authorName: 'J.',
          isPinned: true,
        },
        {
          id: '2',
          title: 'Literature Order',
          content:
            'We will be placing a bulk literature order next week. Please let M. know if you need any specific books or pamphlets.',
          date: new Date('2024-04-25'),
          authorId: '2',
          authorName: 'M.',
          isPinned: false,
        },
        {
          id: '3',
          title: 'New Meeting Format',
          content:
            'Starting next month, we will be incorporating a 10-minute meditation at the beginning of our meetings.',
          date: new Date('2024-04-20'),
          authorId: '3',
          authorName: 'S.',
          isPinned: false,
        },
      ];
      setAnnouncements(mockAnnouncements);

      // Mock upcoming events
      const mockEvents: GroupEvent[] = [
        {
          id: '1',
          title: 'Spring Speaker Meeting',
          description:
            'Join us for our quarterly speaker meeting featuring J. from the Downtown Group with 15 years of sobriety.',
          date: new Date('2024-05-20'),
          location: 'Our regular meeting room',
          isOnline: false,
        },
        {
          id: '2',
          title: 'Group Anniversary Celebration',
          description:
            'Celebrating 14 years of the Serenity Now Group with cake, coffee, and fellowship.',
          date: new Date('2024-05-15'),
          location: 'Community Center Atrium',
          isOnline: false,
        },
        {
          id: '3',
          title: 'Step Workshop - Steps 6 & 7',
          description:
            'Virtual workshop on Steps 6 & 7 with speakers from across the country.',
          date: new Date('2024-06-05'),
          location: 'Zoom',
          isOnline: true,
          meetingLink: 'https://zoom.us/j/123456789',
        },
      ];
      setEvents(mockEvents);

      // Mock treasury overview
      const mockTreasury: TreasuryOverview = {
        balance: 850.75,
        monthlyIncome: 325.5,
        monthlyExpenses: 275.0,
        prudentReserve: 600.0,
        lastUpdated: new Date('2024-04-15'),
      };
      setTreasuryOverview(mockTreasury);
    } catch (error) {
      console.error('Error loading group data:', error);
      Alert.alert(
        'Error',
        'Failed to load group data. Please try again later.',
      );
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateSobrietyYears = (dateString: string): number => {
    const sobrietyDate = new Date(dateString);
    const today = new Date();
    const yearInMs = 365.25 * 24 * 60 * 60 * 1000; // Average year including leap years
    const diffInMs = today.getTime() - sobrietyDate.getTime();
    return Math.floor(diffInMs / yearInMs);
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) {
      Alert.alert(
        'Error',
        'Please provide both a title and content for the announcement.',
      );
      return;
    }

    // Create new announcement
    const newAnnouncement: GroupAnnouncement = {
      id: Date.now().toString(),
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      date: new Date(),
      authorId: 'currentUser', // Would be the current user's ID
      authorName: 'You', // Would be the current user's name
      isPinned: false,
    };

    // Add to list
    setAnnouncements([newAnnouncement, ...announcements]);

    // Reset form and close modal
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    setModalVisible(false);

    // Show success message
    Alert.alert('Success', 'Announcement posted successfully.');
  };

  const handleAddEvent = () => {
    if (
      !newEventTitle.trim() ||
      !newEventDescription.trim() ||
      !newEventDate.trim() ||
      !newEventLocation.trim()
    ) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    if (newEventIsOnline && !newEventMeetingLink.trim()) {
      Alert.alert(
        'Error',
        'Please provide a meeting link for the online event.',
      );
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (!dateRegex.test(newEventDate)) {
      Alert.alert('Error', 'Please use the format YYYY-MM-DD for the date.');
      return;
    }

    // Create new event
    const newEvent: GroupEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      description: newEventDescription,
      date: new Date(newEventDate),
      location: newEventLocation,
      isOnline: newEventIsOnline,
      meetingLink: newEventIsOnline ? newEventMeetingLink : undefined,
    };

    // Add to list
    setEvents(
      [...events, newEvent].sort((a, b) => a.date.getTime() - b.date.getTime()),
    );

    // Reset form and close modal
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventDate('');
    setNewEventLocation('');
    setNewEventIsOnline(false);
    setNewEventMeetingLink('');
    setModalVisible(false);

    // Show success message
    Alert.alert('Success', 'Event added successfully.');
  };

  const showAddModal = (type: ModalType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const renderAddAnnouncementModal = () => (
    <Modal
      visible={modalVisible && modalType === 'announcement'}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Announcement</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={newAnnouncementTitle}
              onChangeText={setNewAnnouncementTitle}
              placeholder="Announcement title"
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.textAreaInput}
              value={newAnnouncementContent}
              onChangeText={setNewAnnouncementContent}
              placeholder="Announcement details..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddAnnouncement}>
              <Text style={styles.submitButtonText}>Post Announcement</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAddEventModal = () => (
    <Modal
      visible={modalVisible && modalType === 'event'}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Event</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholder="Event title"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textAreaInput}
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              placeholder="Event details..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              value={newEventDate}
              onChangeText={setNewEventDate}
              placeholder="2024-05-15"
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setNewEventIsOnline(!newEventIsOnline)}>
                <View
                  style={[
                    styles.checkboxInner,
                    newEventIsOnline && styles.checkboxActive,
                  ]}>
                  {newEventIsOnline && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>This is an online event</Text>
            </View>

            <Text style={styles.inputLabel}>
              {newEventIsOnline ? 'Meeting Link' : 'Location'}
            </Text>
            {newEventIsOnline ? (
              <TextInput
                style={styles.textInput}
                value={newEventMeetingLink}
                onChangeText={setNewEventMeetingLink}
                placeholder="https://zoom.us/..."
              />
            ) : (
              <TextInput
                style={styles.textInput}
                value={newEventLocation}
                onChangeText={setNewEventLocation}
                placeholder="Event location"
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddEvent}>
              <Text style={styles.submitButtonText}>Add Event</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderHomeTab = () => (
    <View style={styles.tabContent}>
      {/* Group Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Group Information</Text>
        </View>

        {group && (
          <View style={styles.groupInfoContainer}>
            <Text style={styles.meetingTimeText}>
              {group.meetingDay}s at {group.meetingTime}
            </Text>
            <Text style={styles.locationText}>{group.location}</Text>
            <Text style={styles.meetingTypeText}>{group.type} Meeting</Text>
            <Text style={styles.memberCountText}>
              {group.memberCount} Members • Founded{' '}
              {formatDate(new Date(group.foundedDate))}
            </Text>
            <Text style={styles.groupDescriptionText}>{group.description}</Text>
          </View>
        )}
      </View>

      {/* Upcoming Sobriety Milestones */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Celebrations</Text>
        </View>

        {milestones.length > 0 ? (
          <View>
            {milestones.map(milestone => (
              <View key={milestone.memberId} style={styles.milestoneItem}>
                <View style={styles.milestoneIconContainer}>
                  <Text style={styles.milestoneIcon}>🎉</Text>
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneName}>
                    {milestone.memberName} - {milestone.years}{' '}
                    {milestone.years === 1 ? 'Year' : 'Years'}
                  </Text>
                  <Text style={styles.milestoneDate}>
                    {formatDate(milestone.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyStateText}>No upcoming celebrations</Text>
        )}
      </View>

      {/* Announcements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {group?.isAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => showAddModal('announcement')}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {announcements.length > 0 ? (
          <View>
            {announcements.map(announcement => (
              <View
                key={announcement.id}
                style={[
                  styles.announcementItem,
                  announcement.isPinned && styles.pinnedItem,
                ]}>
                {announcement.isPinned && (
                  <View style={styles.pinnedFlag}>
                    <Text style={styles.pinnedText}>📌 Pinned</Text>
                  </View>
                )}
                <Text style={styles.announcementTitle}>
                  {announcement.title}
                </Text>
                <Text style={styles.announcementContent}>
                  {announcement.content}
                </Text>
                <View style={styles.announcementFooter}>
                  <Text style={styles.announcementMeta}>
                    Posted by {announcement.authorName} on{' '}
                    {formatDate(announcement.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyStateText}>No announcements</Text>
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {group?.isAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => showAddModal('event')}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {events.length > 0 ? (
          <View>
            {events.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDateContainer}>
                  <Text style={styles.eventMonth}>
                    {event.date.toLocaleDateString('en-US', {month: 'short'})}
                  </Text>
                  <Text style={styles.eventDay}>
                    {event.date.toLocaleDateString('en-US', {day: 'numeric'})}
                  </Text>
                </View>

                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>

                  <View style={styles.eventDetailsContainer}>
                    {event.isOnline ? (
                      <View style={styles.eventLocationContainer}>
                        <Text style={styles.eventLocationIcon}>🖥️</Text>
                        <Text style={styles.eventLocation}>Online Meeting</Text>
                      </View>
                    ) : (
                      <View style={styles.eventLocationContainer}>
                        <Text style={styles.eventLocationIcon}>📍</Text>
                        <Text style={styles.eventLocation}>
                          {event.location}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.eventTime}>
                      {event.date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  {event.isOnline && event.meetingLink && (
                    <TouchableOpacity
                      style={styles.joinMeetingButton}
                      onPress={() =>
                        Alert.alert(
                          'Join Meeting',
                          `This would open: ${event.meetingLink}`,
                        )
                      }>
                      <Text style={styles.joinMeetingButtonText}>
                        Join Meeting
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyStateText}>No upcoming events</Text>
        )}
      </View>

      {/* Treasury Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Treasury Overview</Text>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() =>
              Alert.alert(
                'View Details',
                'This would navigate to the full treasury screen',
              )
            }>
            <Text style={styles.viewMoreButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {treasuryOverview && (
          <View style={styles.treasuryOverviewContainer}>
            <View style={styles.treasuryBalanceContainer}>
              <Text style={styles.treasuryBalanceLabel}>Current Balance</Text>
              <Text style={styles.treasuryBalanceAmount}>
                {formatCurrency(treasuryOverview.balance)}
              </Text>
              <Text style={styles.treasuryLastUpdated}>
                Last updated: {formatDate(treasuryOverview.lastUpdated)}
              </Text>
            </View>

            <View style={styles.treasuryDetailsContainer}>
              <View style={styles.treasuryDetailItem}>
                <Text style={styles.treasuryDetailLabel}>Monthly Income</Text>
                <Text style={styles.treasuryDetailAmount}>
                  {formatCurrency(treasuryOverview.monthlyIncome)}
                </Text>
              </View>

              <View style={styles.treasuryDetailItem}>
                <Text style={styles.treasuryDetailLabel}>Monthly Expenses</Text>
                <Text style={styles.treasuryDetailAmount}>
                  {formatCurrency(treasuryOverview.monthlyExpenses)}
                </Text>
              </View>

              <View style={styles.treasuryDetailItem}>
                <Text style={styles.treasuryDetailLabel}>Prudent Reserve</Text>
                <Text style={styles.treasuryDetailAmount}>
                  {formatCurrency(treasuryOverview.prudentReserve)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderMembersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          <Text style={styles.memberCount}>{members.length} Members</Text>
        </View>

        {/* Service Positions */}
        <View style={styles.servicePositionsContainer}>
          <Text style={styles.subsectionTitle}>Service Positions</Text>

          {members
            .filter(m => m.position)
            .map(member => (
              <View key={member.id} style={styles.servicePositionItem}>
                <View style={styles.servicePositionNameContainer}>
                  <Text style={styles.servicePositionName}>
                    {member.position}
                  </Text>
                </View>
                <View style={styles.servicePositionMemberContainer}>
                  <Text style={styles.servicePositionMember}>
                    {member.name}
                  </Text>
                  {member.sobrietyDate && (
                    <Text style={styles.servicePositionSobriety}>
                      {calculateSobrietyYears(member.sobrietyDate)} years
                    </Text>
                  )}
                </View>
              </View>
            ))}
        </View>

        {/* All Members */}
        <View style={styles.allMembersContainer}>
          <Text style={styles.subsectionTitle}>All Members</Text>

          {members.map(member => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberInitialContainer}>
                <Text style={styles.memberInitial}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberDetailsContainer}>
                <Text style={styles.memberName}>{member.name}</Text>
                {member.sobrietyDate && (
                  <Text style={styles.memberSobriety}>
                    Sobriety Date: {formatDate(new Date(member.sobrietyDate))} (
                    {calculateSobrietyYears(member.sobrietyDate)} years)
                  </Text>
                )}
                {member.position && (
                  <View style={styles.memberPositionBadge}>
                    <Text style={styles.memberPositionText}>
                      {member.position}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLiteratureTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group Literature</Text>
        <Text style={styles.emptyStateText}>Coming soon</Text>
      </View>
    </View>
  );

  if (!group) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading group information...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Group Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{group.name}</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            Alert.alert('Menu', 'Group options would appear here')
          }>
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'home' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('home')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'home' && styles.activeTabButtonText,
            ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'members' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('members')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'members' && styles.activeTabButtonText,
            ]}>
            Members
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'literature' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('literature')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'literature' && styles.activeTabButtonText,
            ]}>
            Literature
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadGroupData} />
        }>
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'members' && renderMembersTab()}
        {activeTab === 'literature' && renderLiteratureTab()}
      </ScrollView>

      {/* Add Announcement Modal */}
      {renderAddAnnouncementModal()}

      {/* Add Event Modal */}
      {renderAddEventModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2196F3',
  },
  menuButton: {
    padding: 4,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#212121',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  activeTabButtonText: {
    color: '#2196F3',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  viewMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewMoreButtonText: {
    fontSize: 14,
    color: '#2196F3',
  },
  groupInfoContainer: {
    marginBottom: 12,
  },
  meetingTimeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 4,
  },
  meetingTypeText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  memberCountText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  groupDescriptionText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  milestoneItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  milestoneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneIcon: {
    fontSize: 20,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 14,
    color: '#757575',
  },
  announcementItem: {
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
  },
  pinnedItem: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  pinnedFlag: {
    marginBottom: 8,
  },
  pinnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  announcementMeta: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  eventItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
  },
  eventDateContainer: {
    width: 50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: 8,
    marginRight: 12,
  },
  eventMonth: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#757575',
  },
  eventTime: {
    fontSize: 14,
    color: '#757575',
  },
  joinMeetingButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  joinMeetingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  treasuryOverviewContainer: {
    marginTop: 8,
  },
  treasuryBalanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  treasuryBalanceLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  treasuryBalanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  treasuryLastUpdated: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  treasuryDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  treasuryDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  treasuryDetailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    textAlign: 'center',
  },
  treasuryDetailAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  emptyStateText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#9E9E9E',
    textAlign: 'center',
    padding: 16,
  },
  memberCount: {
    fontSize: 14,
    color: '#757575',
  },
  servicePositionsContainer: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  servicePositionItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  servicePositionNameContainer: {
    width: 100,
    marginRight: 12,
  },
  servicePositionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  servicePositionMemberContainer: {
    flex: 1,
  },
  servicePositionMember: {
    fontSize: 14,
    color: '#424242',
  },
  servicePositionSobriety: {
    fontSize: 12,
    color: '#757575',
  },
  allMembersContainer: {
    marginTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInitialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  memberDetailsContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  memberSobriety: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  memberPositionBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  memberPositionText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#757575',
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#212121',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#212121',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    height: 16,
    width: 16,
    borderRadius: 2,
  },
  checkboxActive: {
    backgroundColor: '#2196F3',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#424242',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomegroupMainScreen;
