import React, { useState, useCallback } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';

const LazyImage = ({
  source,
  style,
  resizeMode = 'cover',
  testID,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  // Manejo el éxito de la carga de la imagen
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    // Animación de fade-in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  // Manejo el error de carga de la imagen
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Convierto el source a el formato correcto
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View style={[styles.container, style]} testID={testID}>
      {isLoading && (
        <View style={styles.placeholder}>
          <ActivityIndicator size="small" color="#666" />
        </View>
      )}
      {hasError && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon} />
        </View>
      )}
      {!hasError && (
        <Animated.Image
          source={imageSource}
          style={[styles.image, { opacity }]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444',
  },
});

export default LazyImage;
