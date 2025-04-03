import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Types
interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  authorName: string;
  expiresAt?: Date;
}

interface AnnouncementListProps {
  groupId: string;
  isAdmin: boolean;
  onAnnouncementPress?: (announcement: Announcement) => void;
}

// Mock function to fetch announcements (replace with actual API call)
const fetchAnnouncements = async (groupId: string): Promise<Announcement[]> => {
  // In a real app, this would hit the API
  // For now, return mock data
  return [
    {
      id: '1',
      title: 'Group Inventory Coming Up',
      content:
        'We will be conducting our annual group inventory after the meeting on May 15th.',
      isPinned: true,
      createdAt: new Date(2025, 2, 15),
      updatedAt: new Date(2025, 2, 15),
      createdBy: 'user1',
      authorName: 'J.',
    },
    {
      id: '2',
      title: 'New Meeting Format',
      content:
        'Starting next month, we will be incorporating a 10-minute meditation at the beginning of our meetings.',
      isPinned: false,
      createdAt: new Date(2025, 2, 10),
      updatedAt: new Date(2025, 2, 10),
      createdBy: 'user2',
      authorName: 'M.',
    },
    {
      id: '3',
      title: 'Literature Order',
      content:
        'We will be placing a bulk literature order next week. Please let the literature chair know if you need any specific books or pamphlets.',
      isPinned: false,
      createdAt: new Date(2025, 2, 5),
      updatedAt: new Date(2025, 2, 5),
      createdBy: 'user3',
      authorName: 'S.',
    },
  ];
};

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  groupId,
  isAdmin,
  onAnnouncementPress,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load announcements
  useEffect(() => {
    loadAnnouncements();
  }, [groupId]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements(groupId);
      // Sort announcements: pinned first, then by creation date (newest first)
      const sorted = data.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      setAnnouncements(sorted);
    } catch (error) {
      console.error('Error loading announcements:', error);
      Alert.alert(
        'Error',
        'Could not load announcements. Please try again later.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
  };

  const handleCreateAnnouncement = async () => {
    // Validate input
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!newContent.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    try {
      setSubmitting(true);

      // In a real app, this would call the API to create the announcement
      // For now, we'll just simulate it
      const currentUser = auth().currentUser;
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        isPinned,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser?.uid || 'anonymous',
        authorName: currentUser?.displayName || 'Anonymous',
      };

      // Add to state
      const updatedAnnouncements = [newAnnouncement, ...announcements];
      // Re-sort
      const sorted = updatedAnnouncements.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      setAnnouncements(sorted);

      // Close modal and reset form
      setCreateModalVisible(false);
      resetForm();

      // Show success message
      Alert.alert('Success', 'Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      Alert.alert(
        'Error',
        'Could not create announcement. Please try again later.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setIsPinned(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem = ({item}: {item: Announcement}) => (
    <TouchableOpacity
      style={[styles.announcementCard, item.isPinned && styles.pinnedCard]}
      onPress={() => onAnnouncementPress && onAnnouncementPress(item)}>
      {item.isPinned && (
        <View style={styles.pinnedBadge}>
          <Text style={styles.pinnedText}>📌 Pinned</Text>
        </View>
      )}
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementContent} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.announcementFooter}>
        <Text style={styles.announcementMeta}>
          Posted by {item.authorName} on {formatDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCreateAnnouncementModal = () => (
    <Modal
      visible={createModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setCreateModalVisible(false);
        resetForm();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Announcement</Text>
            <TouchableOpacity
              onPress={() => {
                setCreateModalVisible(false);
                resetForm();
              }}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter announcement title"
              maxLength={100}
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="Enter announcement details..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={2000}
            />

            <TouchableOpacity
              style={styles.pinnedCheckbox}
              onPress={() => setIsPinned(!isPinned)}>
              <View
                style={[styles.checkbox, isPinned && styles.checkboxActive]}>
                {isPinned && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Pin this announcement</Text>
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Pinned announcements will appear at the top of the list. Only 3
              announcements can be pinned at a time.
            </Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateAnnouncement}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Post Announcement</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Announcements</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No announcements yet</Text>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => setCreateModalVisible(true)}>
                  <Text style={styles.createButtonText}>
                    Create Announcement
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {renderCreateAnnouncementModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pinnedCard: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  pinnedBadge: {
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
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
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
    fontSize: 20,
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
  titleInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 160,
  },
  pinnedCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#424242',
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnnouncementList;
