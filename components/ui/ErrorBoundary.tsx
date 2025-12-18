import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { colors } from '@/constants/colors';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  info?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log('[ErrorBoundary] Caught error', error, info);
    this.setState({ info });
  }

  private reset = () => {
    console.log('[ErrorBoundary] Reset requested');
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  render() {
    if (this.state.hasError) {
      const details = [
        this.state.error?.message ? `Message: ${this.state.error.message}` : null,
        this.state.error?.stack ? `Stack:\n${this.state.error.stack}` : null,
        this.state.info?.componentStack ? `Component stack:\n${this.state.info.componentStack}` : null,
      ]
        .filter(Boolean)
        .join('\n\n');

      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>App crashed</Text>
          <Text style={styles.message}>
            Something went wrong while rendering. Tap “Try again” to reset the screen.
          </Text>

          <Pressable style={styles.primaryButton} onPress={this.reset} testID="error-boundary-try-again">
            <Text style={styles.primaryButtonText}>Try again</Text>
          </Pressable>

          {!!details && (
            <ScrollView
              style={styles.details}
              contentContainerStyle={styles.detailsContent}
              showsVerticalScrollIndicator
              testID="error-boundary-details"
            >
              <Text selectable style={styles.detailsText}>
                {Platform.OS === 'web' ? details : details}
              </Text>
            </ScrollView>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  message: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 420,
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    marginTop: 8,
    width: '100%',
    maxWidth: 680,
    maxHeight: 260,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  detailsContent: {
    padding: 12,
  },
  detailsText: {
    color: colors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
});