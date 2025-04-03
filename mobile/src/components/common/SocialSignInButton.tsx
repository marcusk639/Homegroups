import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Image,
  View,
} from 'react-native';
import theme from '../../theme';

interface SocialSignInButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({
  provider,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  // Google logo component
  const GoogleLogo = () => (
    <Image
      source={{
        uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
      }}
      style={styles.providerLogo}
      resizeMode="contain"
    />
  );

  // Apple logo component
  const AppleLogo = () => (
    <Image
      source={{
        uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      }}
      style={styles.providerLogo}
      resizeMode="contain"
    />
  );

  const getProviderLogo = () => {
    switch (provider) {
      case 'google':
        return <GoogleLogo />;
      case 'apple':
        return <AppleLogo />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (provider) {
      case 'google':
        return 'Continue with Google';
      case 'apple':
        return 'Continue with Apple';
      default:
        return 'Continue with Provider';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled || loading ? styles.disabledButton : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.text.primary} />
      ) : (
        <View style={styles.buttonContent}>
          {getProviderLogo()}
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.grey[300],
    marginVertical: theme.spacing.sm,
  },
  disabledButton: {
    backgroundColor: theme.colors.grey[100],
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerLogo: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.md,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
});

export default SocialSignInButton;
