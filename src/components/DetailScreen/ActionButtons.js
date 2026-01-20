import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ActionButtons = ({ testID }) => {
  // Botones decorativos - no tienen funcionalidad real
  // Solo estan para completar el diseño estilo Netflix
  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.7}
        testID={`${testID}-share`}
      >
        <Text style={styles.actionIcon}>↗</Text>
        <Text style={styles.actionText}>Compartir</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.7}
        testID={`${testID}-download`}
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
