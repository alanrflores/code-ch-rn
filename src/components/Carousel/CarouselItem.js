import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LazyImage from '../common/LazyImage';

const CarouselItem = ({ item, dimensions, onPress, testID }) => {
  // Manejo el clic en el item
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  return (
    <TouchableOpacity
      style={[styles.container, { width: dimensions.width }]}
      onPress={handlePress}
      activeOpacity={0.8}
      testID={testID}
    >
      <LazyImage
        source={item.imageUrl}
        style={[
          styles.image,
          { width: dimensions.width, height: dimensions.height },
        ]}
        testID={`${testID}-image`}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>

      {item.hasVideo && (
        <View
          style={styles.playIndicator}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel="Tiene video disponible"
        >
          <Text style={styles.playIcon}>▶</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    borderRadius: 8,
  },
  titleContainer: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  playIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 2,
  },
});

export default CarouselItem;
