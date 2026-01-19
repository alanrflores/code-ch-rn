import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoPlayer = ({ item, visible, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Reinicio el estado cuando el modal se cierra para asegurar un estado limpio en la próxima apertura
  useEffect(() => {
    if (!visible) {
      setIsLoading(true);
      setError(null);
    }
  }, [visible]);

  // Verifico si el video está disponible
  // Uso el optional chaining porque el item puede ser null durante la animación de cierre
  const hasVideo = item?.videoUrl && item.videoUrl.trim() !== '';

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

  // Manejo el final de la reproducción del video
  const handleEnd = useCallback(() => {
    // Optionally auto-close or restart
  }, []);

  // Manejo el clic en el botón de cierre
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title || 'Video'}
          </Text>
        </View>
        <View style={styles.content}>
          {!item ? (
            // Esqueleto mientras se cierra - evita el "video no disponible" flash
            // Esto sucede durante la condición de carrera cuando Redux limpia selectedItem
            <ActivityIndicator size="large" color="#fff" />
          ) : !hasVideo ? (
            // Mensaje de video no disponible
            <View style={styles.noVideoContainer}>
              <View style={styles.noVideoIcon}>
                <Text style={styles.noVideoIconText}>🎬</Text>
              </View>
              <Text style={styles.noVideoText}>Video no disponible</Text>
              <Text style={styles.noVideoSubtext}>
                Este contenido no tiene un video asociado
              </Text>
            </View>
          ) : error ? (
            // Estado de error
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setError(null)}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Reproductor de video
            <>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>Cargando video...</Text>
                </View>
              )}
              <Video
                ref={videoRef}
                source={{ uri: item.videoUrl }}
                style={styles.video}
                resizeMode="contain"
                controls={true}
                onLoadStart={handleLoadStart}
                onLoad={handleLoad}
                onError={handleError}
                onEnd={handleEnd}
                // Evito el audio de otras apps
                ignoreSilentSwitch="ignore"
                // Repito para pruebas
                repeat={false}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 70,
    zIndex: 100,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  noVideoContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noVideoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noVideoIconText: {
    fontSize: 40,
  },
  noVideoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  noVideoSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VideoPlayer;
