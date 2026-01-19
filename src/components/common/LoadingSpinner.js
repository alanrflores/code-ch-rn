/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

/**
 * LoadingSpinner - Full screen or inline loading indicator
 *
 * @param {object} props
 * @param {boolean} props.fullScreen - Whether to take full screen
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - Spinner size ('small' | 'large')
 * @param {string} props.color - Spinner color
 */
const LoadingSpinner = ({
  fullScreen = false,
  message,
  size = 'large',
  color = '#fff',
}) => {
  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  inlineContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    color: '#fff',
    fontSize: 14,
  },
});

export default LoadingSpinner;
