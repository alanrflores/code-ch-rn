import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import Video from 'react-native-video';
import LazyImage from '../common/LazyImage';

const toolboxGoIcon = require('../../assets/toolbox-go.png');

const PLAY_BUTTON_SIZE = 54;
const LOADING_RING_SIZE = 66;

const VideoSection = ({
  item,
  isPlaying,
  isFullscreen,
  onPlayPress,
  onClose,
  onToggleFullscreen,
  fullscreenDimensions,
  testID,
}) => {
  const { width } = useWindowDimensions();

  // Dimensiones del video segun el modo
  const videoWidth = isFullscreen ? fullscreenDimensions?.width || width : width;
  const videoHeight = isFullscreen ? fullscreenDimensions?.height || width * 0.56 : width * 0.56;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  const hasVideo = item?.videoUrl && item.videoUrl.trim() !== '';

  // Animacion de rotacion del loading ring
  useEffect(() => {
    if (isPlaying && isLoading) {
      const animation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => animation.stop();
    } else {
      spinAnim.setValue(0);
    }
  }, [isPlaying, isLoading, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Manejo el inicio de carga del video
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  // Manejo el video listo para reproducir
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Manejo el error de carga del video
  const handleError = useCallback((err) => {
    setIsLoading(false);
    setError('Error al reproducir el video');
    console.error('Video error:', err);
  }, []);

  // Renderizo el boton de play con loading ring opcional
  const renderPlayButton = () => (
    <TouchableOpacity
      style={styles.playButton}
      onPress={onPlayPress}
      activeOpacity={0.8}
      testID={`${testID}-play-button`}
      disabled={isPlaying && isLoading}
    >
      {/* Loading ring animado */}
      {isPlaying && isLoading && (
        <Animated.View
          style={[
            styles.loadingRing,
            { transform: [{ rotate: spin }] },
          ]}
        />
      )}
      {/* Boton de play */}
      <View style={styles.playButtonInner}>
        <Text style={styles.playIcon}>▶</Text>
      </View>
    </TouchableOpacity>
  );

  // Renderizo error
  const renderError = () => (
    <View style={styles.errorOverlay}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setError(null);
          onPlayPress();
        }}
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { width: videoWidth, height: videoHeight },
        isFullscreen && styles.fullscreenContainer,
      ]}
      testID={testID}
    >
      {/* Imagen de fondo o placeholder de video no disponible */}
      {!isFullscreen && (
        hasVideo ? (
          item?.imageUrl && (
            <>
              <LazyImage
                source={item.imageUrl}
                style={[styles.backgroundImage, { width: videoWidth, height: videoHeight }]}
                resizeMode="cover"
                testID={`${testID}-image`}
              />
              <View style={styles.imageOverlay} />
            </>
          )
        ) : (
          item && (
            <View style={[styles.noVideoPlaceholder, { width: videoWidth, height: videoHeight }]}>
              <Image
                source={toolboxGoIcon}
                style={styles.noVideoIcon}
                resizeMode="contain"
              />
              <Text style={styles.noVideoText}>Video no disponible</Text>
            </View>
          )
        )
      )}

      {/* Video */}
      {isPlaying && hasVideo && !error && (
        <Video
          ref={videoRef}
          source={{ uri: item.videoUrl }}
          style={[
            styles.video,
            { width: videoWidth, height: videoHeight },
          ]}
          resizeMode={isFullscreen ? 'contain' : 'cover'}
          controls={true}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          ignoreSilentSwitch="ignore"
          repeat={false}
          testID={`${testID}-video`}
        />
      )}

      {/* Boton de play con loading ring - solo en portrait cuando no esta reproduciendo o esta cargando */}
      {!isFullscreen && hasVideo && !error && (!isPlaying || isLoading) && renderPlayButton()}

      {/* Error overlay */}
      {error && renderError()}

      {/* Header con boton cerrar - SOLO en fullscreen */}
      {isFullscreen && (
        <View style={styles.fullscreenHeader}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity
            style={styles.fullscreenCloseButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`${testID}-close-button`}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  noVideoPlaceholder: {
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoIcon: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  noVideoText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fullscreenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    zIndex: 100,
  },
  headerSpacer: {
    flex: 1,
  },
  fullscreenCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -PLAY_BUTTON_SIZE / 2,
    marginTop: -PLAY_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  loadingRing: {
    position: 'absolute',
    width: LOADING_RING_SIZE,
    height: LOADING_RING_SIZE,
    borderRadius: LOADING_RING_SIZE / 2,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#e50914',
    borderRightColor: '#e50914',
  },
  playButtonInner: {
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 3,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 60,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VideoSection;
