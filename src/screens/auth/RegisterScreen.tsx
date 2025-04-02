import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

// Define RegisterData type for form state
interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  recoveryDate: string;
  agreeToTerms: boolean;
}

// Define validation errors type
interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  agreeToTerms: string;
}

// Define navigation prop type
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

type RegisterScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    recoveryDate: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: '',
  });

  const validateStep1 = (): boolean => {
    let isValid = true;
    const newErrors = {...errors};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    let isValid = true;
    const newErrors = {...errors};

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
      isValid = false;
    } else {
      newErrors.displayName = '';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
      isValid = false;
    } else {
      newErrors.agreeToTerms = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    field: keyof RegisterData,
    value: string | boolean,
  ): void => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const nextStep = (): void => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = (): void => {
    setStep(1);
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would call Firebase authentication
      // For the MVP, we'll just simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to Main app after successful registration
      navigation.replace('Main');
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'Please try again later or contact support if the problem persists.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Component to render progress indicator
  const ProgressIndicator = (): React.ReactElement => (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View style={[styles.stepCircle, step >= 1 ? styles.activeStep : {}]}>
          <Text
            style={[
              styles.stepNumber,
              step >= 1 ? styles.activeStepNumber : {},
            ]}>
            1
          </Text>
        </View>
        <Text
          style={[styles.stepLabel, step >= 1 ? styles.activeStepLabel : {}]}>
          Account
        </Text>
      </View>

      <View
        style={[
          styles.progressLine,
          step >= 2 ? styles.activeProgressLine : {},
        ]}
      />

      <View style={styles.progressStep}>
        <View style={[styles.stepCircle, step >= 2 ? styles.activeStep : {}]}>
          <Text
            style={[
              styles.stepNumber,
              step >= 2 ? styles.activeStepNumber : {},
            ]}>
            2
          </Text>
        </View>
        <Text
          style={[styles.stepLabel, step >= 2 ? styles.activeStepLabel : {}]}>
          Profile
        </Text>
      </View>
    </View>
  );

  // Render different steps based on current step state
  const renderStepContent = (): React.ReactElement => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Create Your Account</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.password ? styles.inputError : null,
                ]}
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
                placeholder="Create a secure password"
                secureTextEntry
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Minimum 8 characters, with at least one letter and one number
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                value={formData.confirmPassword}
                onChangeText={text =>
                  handleInputChange('confirmPassword', text)
                }
                placeholder="Confirm your password"
                secureTextEntry
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Your Profile</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.displayName ? styles.inputError : null,
                ]}
                value={formData.displayName}
                onChangeText={text => handleInputChange('displayName', text)}
                placeholder="First name or initial only"
              />
              {errors.displayName ? (
                <Text style={styles.errorText}>{errors.displayName}</Text>
              ) : (
                <Text style={styles.helperText}>
                  For anonymity, we recommend using only your first name or
                  initial
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Recovery Date (Optional)</Text>
              <TextInput
                style={styles.input}
                value={formData.recoveryDate}
                onChangeText={text => handleInputChange('recoveryDate', text)}
                placeholder="YYYY-MM-DD"
              />
              <Text style={styles.helperText}>
                Used only for sobriety celebrations (you can add this later)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() =>
                handleInputChange('agreeToTerms', !formData.agreeToTerms)
              }>
              <View
                style={[
                  styles.checkbox,
                  formData.agreeToTerms ? styles.checkboxChecked : {},
                ]}>
                {formData.agreeToTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
                {errors.agreeToTerms ? (
                  <Text style={styles.errorText}>{errors.agreeToTerms}</Text>
                ) : null}
              </View>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.halfButton]}
                onPress={prevStep}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, styles.halfButton]}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>RC</Text>
            </View>
            <Text style={styles.appName}>Recovery Connect</Text>
          </View>

          {/* Registration Form Card */}
          <View style={styles.formCard}>
            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Step Content */}
            {renderStepContent()}
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#2196F3',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  activeStepNumber: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#757575',
  },
  activeStepLabel: {
    color: '#2196F3',
    fontWeight: '500',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  activeProgressLine: {
    backgroundColor: '#2196F3',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#757575',
    fontSize: 12,
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2196F3',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 0.48,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    color: '#757575',
    fontSize: 14,
    marginRight: 4,
  },
  signInLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;
