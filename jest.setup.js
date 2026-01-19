/**
 * Jest Setup File
 * Mocks and global configuration for tests
 */

import '@testing-library/react-native/build/matchers/extend-expect';

// Mock react-native-video
jest.mock('react-native-video', () => 'Video');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => insets,
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
