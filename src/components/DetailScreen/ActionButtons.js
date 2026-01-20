import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// Este componente es PURAMENTE DECORATIVO.
// Los botones de Compartir y Descargar NO tienen funcionalidad implementada.

const ActionButtons = ({ testID }) => {
  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.7}
        testID={`${testID}-share`}
        accessibilityRole="button"
        accessibilityLabel="Compartir contenido"
        accessibilityHint="Funcionalidad no disponible en esta versión"
      >
        <Text style={styles.actionIcon}>↗</Text>
        <Text style={styles.actionText}>Compartir</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.7}
        testID={`${testID}-download`}
        accessibilityRole="button"
        accessibilityLabel="Descargar contenido"
        accessibilityHint="Funcionalidad no disponible en esta versión"
      >
        <Text style={styles.actionIcon}>↓</Text>
        <Text style={styles.actionText}>Descargar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionIcon: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 2,
  },
  actionText: {
    fontSize: 11,
    color: '#888',
  },
});

export default ActionButtons;
