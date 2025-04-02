import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LandingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoSmall}>
          <Text style={styles.logoText}>RC</Text>
        </View>
        <Text style={styles.headerTitle}>Recovery Connect</Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Find support in your recovery journey
          </Text>
          <Text style={styles.heroSubtitle}>
            Connect with your recovery community while maintaining anonymity and
            privacy. Meeting schedules, group announcements, and treasury
            management made simple.
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                /* Navigate to meeting finder */
              }}>
              <Text style={styles.primaryButtonText}>Find a Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryButtonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyNoteText}>
              <Text style={styles.privacyNoteBold}>Privacy First:</Text> We
              respect anonymity. First names only, encrypted messages, and no
              social media integration.
            </Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              {/* Calendar Icon */}
            </View>
            <Text style={styles.featureTitle}>Meeting Directory</Text>
            <Text style={styles.featureDescription}>
              Find meetings, save your schedule, and get reminders for your
              homegroup.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>{/* Chat Icon */}</View>
            <Text style={styles.featureTitle}>Group Communication</Text>
            <Text style={styles.featureDescription}>
              Secure announcements and messaging for your recovery community.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>{/* Money Icon */}</View>
            <Text style={styles.featureTitle}>Treasury Management</Text>
            <Text style={styles.featureDescription}>
              Track 7th Tradition contributions and expenses with easy handoff
              between treasurers.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Recovery Connect</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerLink}>About</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyNote: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  privacyNoteText: {
    fontSize: 14,
    color: '#424242',
  },
  privacyNoteBold: {
    fontWeight: 'bold',
  },
  featuresSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  featureCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#616161',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#2196F3',
    marginHorizontal: 8,
  },
});

export default LandingScreen;
