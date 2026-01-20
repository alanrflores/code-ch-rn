import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import CarouselItem from './CarouselItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dimensiones del thumb (horizontal ratio ~16:9)
const THUMB_WIDTH = SCREEN_WIDTH * 0.7; // Aproximadamente 1.5 items visibles
const THUMB_HEIGHT = THUMB_WIDTH * 0.5625; // 16:9 aspect ratio

const ThumbCarousel = ({ carousel, onItemPress, testID }) => {
  // Renderizo un solo item del carrusel
  const renderItem = useCallback(
    ({ item, index }) => (
      <CarouselItem
        item={item}
        dimensions={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
        onPress={onItemPress}
        variant="thumb"
        testID={`${testID}-item-${index}`}
      />
    ),
    [onItemPress, testID]
  );

  // Extraigo la key para el FlatList
  const keyExtractor = useCallback((item) => item.id, []);

  // Obtengo el layout del item para la optimización de FlatList
  const getItemLayout = useCallback(
    (_, index) => ({
      length: THUMB_WIDTH + 10, // width + marginRight
      offset: (THUMB_WIDTH + 10) * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>{carousel.title}</Text>
      <FlatList
        data={carousel.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // Optimizaciones de rendimiento
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={3}
        initialNumToRender={2}
        getItemLayout={getItemLayout}
        // Snap to items para mejor UX
        snapToInterval={THUMB_WIDTH + 10}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    marginLeft: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default ThumbCarousel;
