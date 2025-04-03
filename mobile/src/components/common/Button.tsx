// src/components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = styles.button;

    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {...buttonStyle, ...styles.primaryButton};
        break;
      case 'secondary':
        buttonStyle = {...buttonStyle, ...styles.secondaryButton};
        break;
      case 'outline':
        buttonStyle = {...buttonStyle, ...styles.outlineButton};
        break;
      case 'text':
        buttonStyle = {...buttonStyle, ...styles.textButton};
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {...buttonStyle, ...styles.smallButton};
        break;
      case 'medium':
        buttonStyle = {...buttonStyle, ...styles.mediumButton};
        break;
      case 'large':
        buttonStyle = {...buttonStyle, ...styles.largeButton};
        break;
    }

    // Full width
    if (fullWidth) {
      buttonStyle = {...buttonStyle, ...styles.fullWidth};
    }

    // Disabled
    if (disabled) {
      buttonStyle = {...buttonStyle, ...styles.disabledButton};
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let textStyleFinal: TextStyle = styles.buttonText;

    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyleFinal = {...textStyleFinal, ...styles.primaryButtonText};
        break;
      case 'secondary':
        textStyleFinal = {...textStyleFinal, ...styles.secondaryButtonText};
        break;
      case 'outline':
        textStyleFinal = {...textStyleFinal, ...styles.outlineButtonText};
        break;
      case 'text':
        textStyleFinal = {...textStyleFinal, ...styles.textButtonText};
        break;
    }

    // Size text styles
    switch (size) {
      case 'small':
        textStyleFinal = {...textStyleFinal, ...styles.smallButtonText};
        break;
      case 'medium':
        textStyleFinal = {...textStyleFinal, ...styles.mediumButtonText};
        break;
      case 'large':
        textStyleFinal = {...textStyleFinal, ...styles.largeButtonText};
        break;
    }

    // Disabled
    if (disabled) {
      textStyleFinal = {...textStyleFinal, ...styles.disabledButtonText};
    }

    return textStyleFinal;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'text'
              ? theme.colors.primary.main
              : theme.colors.primary.contrastText
          }
        />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.roundness,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  mediumButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    backgroundColor: theme.colors.grey[300],
    borderColor: theme.colors.grey[300],
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: theme.colors.primary.contrastText,
  },
  secondaryButtonText: {
    color: theme.colors.secondary.contrastText,
  },
  outlineButtonText: {
    color: theme.colors.primary.main,
  },
  textButtonText: {
    color: theme.colors.primary.main,
  },
  smallButtonText: {
    fontSize: theme.fontSizes.sm,
  },
  mediumButtonText: {
    fontSize: theme.fontSizes.md,
  },
  largeButtonText: {
    fontSize: theme.fontSizes.lg,
  },
  disabledButtonText: {
    color: theme.colors.grey[600],
  },
});

export default Button;
