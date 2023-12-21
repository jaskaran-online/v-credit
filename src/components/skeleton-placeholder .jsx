import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SkeletonPlaceholder = ({ width, height, borderRadius = 0 }) => {
  const animatedValue = useSharedValue(-100);

  React.useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(100, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedValue.value }],
    };
  });

  const containerStyle = {
    width: width || '100%',
    height: height || 20,
    borderRadius: borderRadius || 10,
    backgroundColor: '#e1e1e1',
    overflow: 'hidden',
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.gradientContainer, animatedStyle]}>
        <LinearGradient
          colors={['#e1e1e1', '#f9f9f9', '#e1e1e1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    elevation: 1,
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
  },
  gradient: {
    height: '100%',
    width: '100%',
  },
  gradientContainer: {
    height: '100%',
    position: 'absolute',
    width: '200%', // Gradient container is twice as wide
  },
});

export default SkeletonPlaceholder;
