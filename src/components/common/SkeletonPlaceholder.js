import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Skeleton item individual con animación de shimmer
const SkeletonItem = ({ width, height, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonItem,
        { width, height, opacity },
        style,
      ]}
    />
  );
};

// Skeleton de un carousel completo
const SkeletonCarousel = ({ type = 'poster' }) => {
  const isPoster = type === 'poster';
  const itemWidth = isPoster ? SCREEN_WIDTH * 0.28 : SCREEN_WIDTH * 0.7;
  const itemHeight = isPoster ? itemWidth * 1.5 : itemWidth * 0.5625;
  const itemCount = isPoster ? 4 : 2;

  return (
    <View style={styles.carouselContainer}>
      {/* Título del carousel */}
      <SkeletonItem width={120} height={20} style={styles.titleSkeleton} />

      {/* Items del carousel */}
      <View style={styles.itemsRow}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <View key={index} style={styles.itemContainer}>
            <SkeletonItem
              width={itemWidth}
              height={itemHeight}
              style={styles.imageSkeleton}
            />
            <SkeletonItem
              width={itemWidth * 0.7}
              height={12}
              style={styles.itemTitleSkeleton}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// Skeleton completo de la pantalla Home
const SkeletonPlaceholder = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerSkeleton}>
        <SkeletonItem width={44} height={44} style={styles.logoSkeleton} />
        <SkeletonItem width={100} height={24} />
      </View>

      {/* Carousels skeleton */}
      <SkeletonCarousel type="thumb" />
      <SkeletonCarousel type="poster" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 16,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  logoSkeleton: {
    borderRadius: 10,
    marginRight: 12,
  },
  carouselContainer: {
    marginBottom: 24,
  },
  titleSkeleton: {
    marginLeft: 16,
    marginBottom: 12,
    borderRadius: 4,
  },
  itemsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginRight: 10,
  },
  imageSkeleton: {
    borderRadius: 8,
  },
  itemTitleSkeleton: {
    marginTop: 8,
    borderRadius: 4,
  },
  skeletonItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
  },
});

export default SkeletonPlaceholder;
