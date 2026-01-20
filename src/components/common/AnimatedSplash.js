import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Dimensions } from 'react-native';
import toolboxLogo from '../../assets/toolbox-logo.png';

const { width, height } = Dimensions.get('window');

const AnimatedSplash = ({ onAnimationEnd }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start bounce animation loop
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();

    // After 2.5s, fade out and call onAnimationEnd
    const timer = setTimeout(() => {
      bounceAnimation.stop();

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onAnimationEnd?.();
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      bounceAnimation.stop();
    };
  }, [bounceAnim, fadeAnim, onAnimationEnd]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Image
        source={toolboxLogo}
        style={[
          styles.logo,
          { transform: [{ translateY: bounceAnim }] },
        ]}
        resizeMode="contain"
      />
      <Text style={styles.title}>Toolbox</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

export default AnimatedSplash;
