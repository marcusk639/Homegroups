import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Meeting types
interface Meeting {
  id: string;
  name: string;
  dayOfWeek: string;
  time: string;
  location: string;
  address: string;
  format: string;
  isOnline: boolean;
  onlineLink?: string;
  groupId: string;
  groupName: string;
  isFavorite: boolean;
}

// Filter options
interface FilterOptions {
  showOnline: boolean;
  showInPerson: boolean;
  day: string | null;
  format: string | null;
}

const MeetingsScreen: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showOnline: true,
    showInPerson: true,
    day: null,
    format: null,
  });

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const formats = [
    'Open Discussion',
    'Speaker',
    'Step Study',
    'Book Study',
    'Beginner',
    'Meditation',
  ];

  useEffect(() => {
    // Load meetings
    loadMeetings();
  }, []);

  useEffect(() => {
    // Apply filters and search
    applyFiltersAndSearch();
  }, [meetings, searchQuery, filterOptions]);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a Firestore query
      // For MVP, we'll use mock data
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          name: 'Morning Serenity',
          dayOfWeek: 'Monday',
          time: '7:30 AM',
          location: 'Community Center',
          address: '123 Main St, Anytown, USA',
          format: 'Open Discussion',
          isOnline: false,
          groupId: 'g1',
          groupName: 'Serenity Group',
          isFavorite: true,
        },
        {
          id: '2',
          name: 'Noon Recovery',
          dayOfWeek: 'Tuesday',
          time: '12:00 PM',
          location: 'Main Street Church',
          address: '456 Main St, Anytown, USA',
          format: 'Speaker',
          isOnline: false,
          groupId: 'g2',
          groupName: 'Recovery Group',
          isFavorite: false,
        },
        {
          id: '3',
          name: 'Evening Meditation',
          dayOfWeek: 'Wednesday',
          time: '7:00 PM',
          location: 'Hope Center',
          address: '789 Hope Ave, Anytown, USA',
          format: 'Meditation',
          isOnline: false,
          groupId: 'g3',
          groupName: 'Hope Group',
          isFavorite: false,
        },
        {
          id: '4',
          name: 'Online Step Study',
          dayOfWeek: 'Thursday',
          time: '6:30 PM',
          location: 'Zoom Meeting',
          address: '',
          format: 'Step Study',
          isOnline: true,
          onlineLink: 'https://zoom.us/j/123456789',
          groupId: 'g4',
          groupName: 'Virtual Recovery',
          isFavorite: true,
        },
        {
          id: '5',
          name: 'Weekend Sharing',
          dayOfWeek: 'Saturday',
          time: '10:00 AM',
          location: 'Community Park',
          address: '101 Park Rd, Anytown, USA',
          format: 'Open Discussion',
          isOnline: false,
          groupId: 'g5',
          groupName: 'Weekend Warriors',
          isFavorite: false,
        },
        {
          id: '6',
          name: 'Virtual Book Study',
          dayOfWeek: 'Sunday',
          time: '8:00 PM',
          location: 'Zoom Meeting',
          address: '',
          format: 'Book Study',
          isOnline: true,
          onlineLink: 'https://zoom.us/j/987654321',
          groupId: 'g6',
          groupName: 'Virtual Recovery',
          isFavorite: false,
        },
      ];

      setMeetings(mockMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      Alert.alert('Error', 'Failed to load meetings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeetings();
    setRefreshing(false);
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...meetings];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        meeting =>
          meeting.name.toLowerCase().includes(query) ||
          meeting.location.toLowerCase().includes(query) ||
          meeting.groupName.toLowerCase().includes(query),
      );
    }

    // Apply filters
    if (!filterOptions.showOnline) {
      filtered = filtered.filter(meeting => !meeting.isOnline);
    }

    if (!filterOptions.showInPerson) {
      filtered = filtered.filter(meeting => meeting.isOnline);
    }

    if (filterOptions.day) {
      filtered = filtered.filter(
        meeting => meeting.dayOfWeek === filterOptions.day,
      );
    }

    if (filterOptions.format) {
      filtered = filtered.filter(
        meeting => meeting.format === filterOptions.format,
      );
    }

    setFilteredMeetings(filtered);
  };

  const toggleFavorite = (meetingId: string) => {
    setMeetings(
      meetings.map(meeting =>
        meeting.id === meetingId
          ? {...meeting, isFavorite: !meeting.isFavorite}
          : meeting,
      ),
    );
  };

  const resetFilters = () => {
    setFilterOptions({
      showOnline: true,
      showInPerson: true,
      day: null,
      format: null,
    });
  };

  const showMeetingDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setMeetingDetailsVisible(true);
  };

  const renderMeetingItem = ({item}: {item: Meeting}) => (
    <TouchableOpacity
      style={styles.meetingCard}
      onPress={() => showMeetingDetails(item)}>
      <View style={styles.meetingHeader}>
        <View style={styles.meetingTimeContainer}>
          <Text style={styles.meetingDay}>{item.dayOfWeek}</Text>
          <Text style={styles.meetingTime}>{item.time}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}>
          <Text style={styles.favoriteIcon}>{item.isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.meetingContent}>
        <Text style={styles.meetingName}>{item.name}</Text>
        <Text style={styles.meetingLocation}>
          {item.isOnline ? 'Online Meeting' : item.location}
        </Text>
        <View style={styles.meetingTags}>
          <View style={styles.formatTag}>
            <Text style={styles.formatTagText}>{item.format}</Text>
          </View>
          {item.isOnline && (
            <View style={[styles.formatTag, styles.onlineTag]}>
              <Text style={styles.formatTagText}>Online</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Meetings</Text>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Meeting Type</Text>
          <View style={styles.typeFilterContainer}>
            <TouchableOpacity
              style={[
                styles.typeFilterButton,
                filterOptions.showInPerson && styles.typeFilterActive,
              ]}
              onPress={() =>
                setFilterOptions({
                  ...filterOptions,
                  showInPerson: !filterOptions.showInPerson,
                })
              }>
              <Text
                style={[
                  styles.typeFilterText,
                  filterOptions.showInPerson && styles.typeFilterActiveText,
                ]}>
                In-Person
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeFilterButton,
                filterOptions.showOnline && styles.typeFilterActive,
              ]}
              onPress={() =>
                setFilterOptions({
                  ...filterOptions,
                  showOnline: !filterOptions.showOnline,
                })
              }>
              <Text
                style={[
                  styles.typeFilterText,
                  filterOptions.showOnline && styles.typeFilterActiveText,
                ]}>
                Online
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Day of Week</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}>
            <TouchableOpacity
              style={[
                styles.dayFilterButton,
                filterOptions.day === null && styles.dayFilterActive,
              ]}
              onPress={() =>
                setFilterOptions({
                  ...filterOptions,
                  day: null,
                })
              }>
              <Text
                style={[
                  styles.dayFilterText,
                  filterOptions.day === null && styles.dayFilterActiveText,
                ]}>
                All
              </Text>
            </TouchableOpacity>

            {days.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayFilterButton,
                  filterOptions.day === day && styles.dayFilterActive,
                ]}
                onPress={() =>
                  setFilterOptions({
                    ...filterOptions,
                    day: filterOptions.day === day ? null : day,
                  })
                }>
                <Text
                  style={[
                    styles.dayFilterText,
                    filterOptions.day === day && styles.dayFilterActiveText,
                  ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterSectionTitle}>Meeting Format</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}>
            <TouchableOpacity
              style={[
                styles.formatFilterButton,
                filterOptions.format === null && styles.formatFilterActive,
              ]}
              onPress={() =>
                setFilterOptions({
                  ...filterOptions,
                  format: null,
                })
              }>
              <Text
                style={[
                  styles.formatFilterText,
                  filterOptions.format === null &&
                    styles.formatFilterActiveText,
                ]}>
                All
              </Text>
            </TouchableOpacity>

            {formats.map(format => (
              <TouchableOpacity
                key={format}
                style={[
                  styles.formatFilterButton,
                  filterOptions.format === format && styles.formatFilterActive,
                ]}
                onPress={() =>
                  setFilterOptions({
                    ...filterOptions,
                    format: filterOptions.format === format ? null : format,
                  })
                }>
                <Text
                  style={[
                    styles.formatFilterText,
                    filterOptions.format === format &&
                      styles.formatFilterActiveText,
                  ]}>
                  {format}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderMeetingDetailsModal = () => (
    <Modal
      visible={meetingDetailsVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setMeetingDetailsVisible(false)}>
      {selectedMeeting && (
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Meeting Details</Text>
              <TouchableOpacity
                onPress={() => setMeetingDetailsVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.meetingDetailContent}>
              <Text style={styles.detailsName}>{selectedMeeting.name}</Text>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Time:</Text>
                <Text style={styles.detailsText}>
                  {selectedMeeting.dayOfWeek}s at {selectedMeeting.time}
                </Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Location:</Text>
                <Text style={styles.detailsText}>
                  {selectedMeeting.isOnline
                    ? 'Online Meeting'
                    : selectedMeeting.location}
                </Text>
                {!selectedMeeting.isOnline && selectedMeeting.address && (
                  <Text style={styles.detailsSubtext}>
                    {selectedMeeting.address}
                  </Text>
                )}
                {selectedMeeting.isOnline && selectedMeeting.onlineLink && (
                  <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>Join Meeting</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Format:</Text>
                <Text style={styles.detailsText}>{selectedMeeting.format}</Text>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Group:</Text>
                <Text style={styles.detailsText}>
                  {selectedMeeting.groupName}
                </Text>
              </View>
            </View>

            <View style={styles.detailsFooter}>
              <TouchableOpacity
                style={[
                  styles.detailsActionButton,
                  selectedMeeting.isFavorite
                    ? styles.removeButton
                    : styles.addButton,
                ]}
                onPress={() => {
                  toggleFavorite(selectedMeeting.id);
                  setSelectedMeeting({
                    ...selectedMeeting,
                    isFavorite: !selectedMeeting.isFavorite,
                  });
                }}>
                <Text style={styles.detailsActionButtonText}>
                  {selectedMeeting.isFavorite
                    ? 'Remove from My Meetings'
                    : 'Add to My Meetings'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.detailsActionButton, styles.joinGroupButton]}
                onPress={() => {
                  // Join group functionality would be implemented here
                  Alert.alert(
                    'Join Group',
                    'Would you like to join this group?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Join',
                        onPress: () => {
                          Alert.alert('Success', 'You have joined the group!');
                          setMeetingDetailsVisible(false);
                        },
                      },
                    ],
                  );
                }}>
                <Text style={styles.detailsActionButtonText}>Join Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meetings</Text>
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search meetings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <>
          {filterOptions.day || filterOptions.format ? (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersText}>
                Active filters:
                {filterOptions.day ? ` ${filterOptions.day}` : ''}
                {filterOptions.format ? ` | ${filterOptions.format}` : ''}
              </Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.clearFiltersText}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <FlatList
            data={filteredMeetings}
            renderItem={renderMeetingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.meetingsList}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No meetings found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </>
      )}

      {renderFilterModal()}
      {renderMeetingDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchContainer: {
    flex: 1,
    marginRight: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    padding: 10,
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#1976D2',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  meetingsList: {
    padding: 16,
  },
  meetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  meetingHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    padding: 16,
  },
  meetingTimeContainer: {
    flex: 1,
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
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FFC107',
  },
  meetingContent: {
    padding: 16,
  },
  meetingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  meetingLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  meetingTags: {
    flexDirection: 'row',
  },
  formatTag: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  onlineTag: {
    backgroundColor: '#E3F2FD',
  },
  formatTagText: {
    fontSize: 12,
    color: '#616161',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9E9E9E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  detailsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#757575',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    marginTop: 8,
  },
  typeFilterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeFilterButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  typeFilterActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  typeFilterText: {
    fontSize: 14,
    color: '#757575',
  },
  typeFilterActiveText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  filterScrollView: {
    marginBottom: 24,
  },
  dayFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginRight: 8,
  },
  dayFilterActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  dayFilterText: {
    fontSize: 14,
    color: '#757575',
  },
  dayFilterActiveText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  formatFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginRight: 8,
  },
  formatFilterActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  formatFilterText: {
    fontSize: 14,
    color: '#757575',
  },
  formatFilterActiveText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    flex: 1,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  meetingDetailContent: {
    marginBottom: 16,
  },
  detailsName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  detailsSubtext: {
    fontSize: 14,
    color: '#757575',
  },
  linkButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailsFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  detailsActionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#E3F2FD',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
  },
  joinGroupButton: {
    backgroundColor: '#2196F3',
  },
  detailsActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});

export default MeetingsScreen;
