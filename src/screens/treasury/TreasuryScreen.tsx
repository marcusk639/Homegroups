import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Types for treasury data
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdBy: string;
}

interface TreasuryStats {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  prudentReserve: number;
  availableFunds: number;
  lastUpdated: Date;
}

const TreasuryScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TreasuryStats>({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    prudentReserve: 0,
    availableFunds: 0,
    lastUpdated: new Date(),
  });

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    'income',
  );
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const incomeCategories = [
    '7th Tradition',
    'Literature Sales',
    'Event Income',
    'Other',
  ];
  const expenseCategories = [
    'Rent',
    'Literature',
    'Refreshments',
    'Events',
    'Contributions',
    'Other',
  ];

  useEffect(() => {
    // Load treasury data
    loadTreasuryData();
  }, []);

  const loadTreasuryData = async () => {
    try {
      // In a real app, this would be a Firestore query
      // For MVP, we'll use mock data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 75.0,
          category: '7th Tradition',
          description: 'Monday meeting',
          date: new Date(2025, 3, 2), // April 2, 2025
          createdBy: 'T',
        },
        {
          id: '2',
          type: 'expense',
          amount: 50.0,
          category: 'Rent',
          description: 'April rent',
          date: new Date(2025, 3, 1), // April 1, 2025
          createdBy: 'J',
        },
        {
          id: '3',
          type: 'income',
          amount: 65.0,
          category: '7th Tradition',
          description: 'Wednesday meeting',
          date: new Date(2025, 2, 30), // March 30, 2025
          createdBy: 'T',
        },
        {
          id: '4',
          type: 'expense',
          amount: 35.5,
          category: 'Literature',
          description: 'New books',
          date: new Date(2025, 2, 28), // March 28, 2025
          createdBy: 'M',
        },
        {
          id: '5',
          type: 'income',
          amount: 80.25,
          category: '7th Tradition',
          description: 'Friday meeting',
          date: new Date(2025, 2, 26), // March 26, 2025
          createdBy: 'T',
        },
      ];

      setTransactions(mockTransactions);

      // Calculate stats
      const mockStats: TreasuryStats = {
        balance: 534.75,
        monthlyIncome: 220.25,
        monthlyExpenses: 85.5,
        prudentReserve: 300.0,
        availableFunds: 234.75,
        lastUpdated: new Date(),
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error loading treasury data:', error);
      Alert.alert(
        'Error',
        'Failed to load treasury data. Please try again later.',
      );
    }
  };

  const addTransaction = () => {
    // Validate input
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(), // In a real app, this would be a Firestore ID
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(),
      createdBy: 'You', // In a real app, this would be the current user's name
    };

    // Update transactions list
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // Update stats
    const updatedStats = {...stats};
    if (transactionType === 'income') {
      updatedStats.balance += parseFloat(amount);
      updatedStats.monthlyIncome += parseFloat(amount);
      updatedStats.availableFunds += parseFloat(amount);
    } else {
      updatedStats.balance -= parseFloat(amount);
      updatedStats.monthlyExpenses += parseFloat(amount);
      updatedStats.availableFunds -= parseFloat(amount);
    }
    updatedStats.lastUpdated = new Date();
    setStats(updatedStats);

    // Close modal and reset form
    setAddModalVisible(false);
    resetForm();

    // Show success message
    Alert.alert('Success', 'Transaction added successfully');
  };

  const resetForm = () => {
    setTransactionType('income');
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTransactionItem = ({item}: {item: Transaction}) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDate}>
        <Text style={styles.transactionDateText}>{formatDate(item.date)}</Text>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text
            style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeText : styles.expenseText,
            ]}>
            {item.type === 'income' ? '+' : '-'}
            {formatCurrency(item.amount)}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.transactionDescription}>{item.description}</Text>
        ) : null}

        <Text style={styles.transactionCreator}>Added by {item.createdBy}</Text>
      </View>
    </View>
  );

  const renderAddTransactionModal = () => (
    <Modal
      visible={addModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setAddModalVisible(false)}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity
              onPress={() => {
                setAddModalVisible(false);
                resetForm();
              }}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.formLabel}>Transaction Type</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  transactionType === 'income' && styles.segmentButtonActive,
                ]}
                onPress={() => setTransactionType('income')}>
                <Text
                  style={[
                    styles.segmentButtonText,
                    transactionType === 'income' &&
                      styles.segmentButtonTextActive,
                  ]}>
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  transactionType === 'expense' && styles.segmentButtonActive,
                ]}
                onPress={() => setTransactionType('expense')}>
                <Text
                  style={[
                    styles.segmentButtonText,
                    transactionType === 'expense' &&
                      styles.segmentButtonTextActive,
                  ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <Text style={styles.formLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}>
              {(transactionType === 'income'
                ? incomeCategories
                : expenseCategories
              ).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}>
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.formLabel}>Description (Optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add description..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treasury</Text>
        <TouchableOpacity
          style={styles.addTransactionButton}
          onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addTransactionButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(stats.balance)}
          </Text>
          <Text style={styles.lastUpdated}>
            Last updated: {formatDate(stats.lastUpdated)}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Monthly Income</Text>
            <Text style={styles.statAmount}>
              {formatCurrency(stats.monthlyIncome)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Monthly Expenses</Text>
            <Text style={styles.statAmount}>
              {formatCurrency(stats.monthlyExpenses)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Prudent Reserve</Text>
            <Text style={styles.statAmount}>
              {formatCurrency(stats.prudentReserve)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Available Funds</Text>
            <Text
              style={[
                styles.statAmount,
                stats.availableFunds < 0 && styles.negativeAmount,
              ]}>
              {formatCurrency(stats.availableFunds)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.transactionsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions</Text>
              <Text style={styles.emptySubtext}>
                Add a transaction to get started
              </Text>
            </View>
          }
        />
      </View>

      {renderAddTransactionModal()}
    </SafeAreaView>
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
  addTransactionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTransactionButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  negativeAmount: {
    color: '#F44336',
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  transactionsList: {
    paddingBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  transactionDate: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
  },
  transactionDateText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  transactionCreator: {
    fontSize: 12,
    color: '#9E9E9E',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
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
  modalScrollView: {
    padding: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    marginTop: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#2196F3',
  },
  segmentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#212121',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  categoryButtonTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TreasuryScreen;
