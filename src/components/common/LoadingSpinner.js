import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

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

LoadingSpinner.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
};

export default LoadingSpinner;
