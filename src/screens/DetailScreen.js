import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {
  VideoSection,
  InfoSection,
  ActionButtons,
} from '../components/DetailScreen';

const FOOTER_HEIGHT = 80;

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const insets = useSafeAreaInsets();

  // Verifico si el video esta disponible
  const hasVideo = item?.videoUrl && item.videoUrl.trim() !== '';

  // Auto-play: cuando se monta y tiene video, arranca automaticamente
  useEffect(() => {
    if (hasVideo) {
      setIsPlaying(true);
    }
  }, [hasVideo]);

  // Cleanup: volver a portrait cuando se desmonta
  useEffect(() => {
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  // Altura del footer incluyendo safe area
  const footerHeight = FOOTER_HEIGHT + insets.bottom;

  // Manejo el clic en el boton de play del preview
  const handlePlayPress = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Manejo el cierre - vuelve a Home
  const handleClose = useCallback(() => {
    Orientation.lockToPortrait();
    setIsPlaying(false);
    setIsFullscreen(false);
    navigation.goBack();
  }, [navigation]);

  // Toggle fullscreen con rotacion
  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      // Salir de fullscreen
      Orientation.lockToPortrait();
      setIsFullscreen(false);
    } else {
      // Entrar en fullscreen
      Orientation.lockToLandscape();
      setIsFullscreen(true);
    }
  }, [isFullscreen]);

  // Si estamos en fullscreen, renderizar solo el video
  if (isFullscreen) {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={styles.fullscreenContainer}>
        <StatusBar hidden />
        <VideoSection
          item={item}
          isPlaying={isPlaying}
          isFullscreen={true}
          onPlayPress={handlePlayPress}
          onClose={handleToggleFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          fullscreenDimensions={{ width: Math.max(width, height), height: Math.min(width, height) }}
          testID="detail-video-section"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header con flecha back */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.scrollView, { paddingTop: insets.top + 50 }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: footerHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Seccion de video/imagen */}
        <VideoSection
          item={item}
          isPlaying={isPlaying}
          isFullscreen={false}
          onPlayPress={handlePlayPress}
          onClose={handleClose}
          onToggleFullscreen={handleToggleFullscreen}
          testID="detail-video-section"
        />

        {/* Seccion de informacion */}
        <InfoSection
          item={item}
          hasVideo={hasVideo}
          onFullscreenPlay={handleToggleFullscreen}
          testID="detail-info-section"
        />
      </ScrollView>

      {/* Footer fijo con botones de accion */}
      <View
        style={[
          styles.footer,
          { height: footerHeight, paddingBottom: insets.bottom },
        ]}
      >
        <ActionButtons testID="detail-action-buttons" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
    justifyContent: 'center',
  },
});

export default DetailScreen;
