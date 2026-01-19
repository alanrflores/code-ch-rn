import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCarousels from '../hooks/useCarousels';
import Carousel from '../components/Carousel';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomeScreen = () => {
  const {
    carousels,
    selectedItem,
    isLoading,
    error,
    isEmpty,
    refetch,
    selectItem,
    clearSelectedItem,
  } = useCarousels();

  // Manejo el clic en un item del carrusel
  const handleItemPress = useCallback(
    (item) => {
      selectItem(item);
    },
    [selectItem]
  );

  // Manejo el cierre del video player
  const handleVideoClose = useCallback(() => {
    clearSelectedItem();
  }, [clearSelectedItem]);

  // Manejo el pull-to-refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Estado de carga
  if (isLoading && isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LoadingSpinner fullScreen message="Cargando contenido..." />
      </SafeAreaView>
    );
  }

  // Estado de error
  if (error && isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            Toca para reintentar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado vacío
  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay contenido disponible</Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            Toca para recargar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toolbox Challenge</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
      >
        {carousels.map((carousel) => (
          <Carousel
            key={carousel.id}
            carousel={carousel}
            onItemPress={handleItemPress}
            testID={`carousel-${carousel.id}`}
          />
        ))}
      </ScrollView>
      <VideoPlayer
        item={selectedItem}
        visible={selectedItem !== null}
        onClose={handleVideoClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 14,
    color: '#4a9eff',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
