import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import CarouselItem from './CarouselItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dimensiones del poster (vertical ratio ~2:3)
const POSTER_WIDTH = SCREEN_WIDTH * 0.28; // Aproximadamente 4 items visibles
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Relación 2:3

const PosterCarousel = ({ carousel, onItemPress, testID }) => {
  // Renderizo un solo item del carrusel
  // Optimización de FlatList: uso de useCallback para evitar re-renders
  const renderItem = useCallback(
    ({ item, index }) => (
      <CarouselItem
        item={item}
        dimensions={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
        onPress={onItemPress}
        variant="poster"
        testID={`${testID}-item-${index}`}
      />
    ),
    [onItemPress, testID]
  );

  // Extraigo la key para el FlatList
  const keyExtractor = useCallback((item) => item.id, []);

  // Obtengo el layout del item para la optimización de FlatList
  // Permite el desplazamiento rápido precalculando las posiciones de los items
  const getItemLayout = useCallback(
    (_, index) => ({
      length: POSTER_WIDTH + 10, // width + marginRight
      offset: (POSTER_WIDTH + 10) * index,
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
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={4}
        getItemLayout={getItemLayout}
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

export default PosterCarousel;
