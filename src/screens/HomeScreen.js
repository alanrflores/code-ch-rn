import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useCarousels from '../hooks/useCarousels';
import Carousel from '../components/Carousel';
import SkeletonPlaceholder from '../components/common/SkeletonPlaceholder';

const toolboxLogo = require('../assets/toolbox-logo.png');

const HomeScreen = () => {
  const navigation = useNavigation();
  const {
    carousels,
    isLoading,
    error,
    isEmpty,
    refetch,
  } = useCarousels();

  // Manejo el clic en un item del carrusel - navego a Detail
  const handleItemPress = useCallback(
    (item) => {
      navigation.navigate('Detail', { item });
    },
    [navigation]
  );

  // Manejo el pull-to-refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Estado de carga - muestra skeleton cuando no hay carousels aún
  if (isLoading && carousels.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SkeletonPlaceholder />
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
        <Image source={toolboxLogo} style={styles.headerLogo} />
        <Text style={styles.headerTitle}>Toolbox</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    backgroundColor: '#0a0a0f',
  },
  headerLogo: {
    width: 44,
    height: 44,
    marginRight: 12,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
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
    color: '#e50914',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
