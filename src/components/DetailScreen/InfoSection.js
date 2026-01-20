import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const InfoSection = ({ item, hasVideo, onFullscreenPlay, testID }) => {
  return (
    <View style={styles.container} testID={testID}>
      {/* Branding */}
      <Text style={styles.branding}>TOOLBOX</Text>

      {/* Titulo */}
      <Text style={styles.title} testID={`${testID}-title`}>
        {item?.title || 'Sin titulo'}
      </Text>

      {/* Botones de accion - estilo Netflix */}
      <View style={styles.buttonsRow}>
        {/* Boton Reproducir Ahora - entra en fullscreen (solo si hay video) */}
        {hasVideo && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={onFullscreenPlay}
            activeOpacity={0.8}
            testID={`${testID}-play-button`}
          >
            <Text style={styles.buttonIcon}>▶</Text>
            <Text style={styles.playButtonText}>REPRODUCIR AHORA</Text>
          </TouchableOpacity>
        )}

        {/* Boton Mi Lista */}
        <TouchableOpacity
          style={styles.listButton}
          activeOpacity={0.8}
          testID={`${testID}-list-button`}
        >
          <Text style={styles.buttonIcon}>+</Text>
          <Text style={styles.listButtonText}>MI LISTA</Text>
        </TouchableOpacity>
      </View>

      {/* Descripcion */}
      <Text style={styles.description} testID={`${testID}-description`}>
        {item?.description || 'Sin descripcion disponible'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  branding: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e50914',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  listButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
});

export default InfoSection;
