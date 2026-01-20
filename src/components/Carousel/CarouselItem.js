import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LazyImage from '../common/LazyImage';

const toolboxGoIcon = require('../../assets/toolbox-go.png');

// Placeholder estilizado cuando no hay imagen disponible
const MoviePlaceholder = ({ width, height, testID }) => (
  <View style={[styles.placeholder, { width, height }]} testID={testID}>
    <Image
      source={toolboxGoIcon}
      style={styles.placeholderIcon}
      resizeMode="contain"
    />
  </View>
);

const CarouselItem = ({ item, dimensions, onPress, testID }) => {
  // Manejo el clic en el item
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  const hasImage = Boolean(item.imageUrl);

  return (
    <TouchableOpacity
      style={[styles.container, { width: dimensions.width }]}
      onPress={handlePress}
      activeOpacity={0.8}
      testID={testID}
    >
      <View style={styles.imageContainer}>
        {hasImage ? (
          <LazyImage
            source={item.imageUrl}
            style={[
              styles.image,
              { width: dimensions.width, height: dimensions.height },
            ]}
            testID={`${testID}-image`}
          />
        ) : (
          <MoviePlaceholder
            width={dimensions.width}
            height={dimensions.height}
            testID={`${testID}-placeholder`}
          />
        )}
        {item.hasVideo && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeText}>Ver ahora</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    borderRadius: 8,
  },
  placeholder: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default CarouselItem;
