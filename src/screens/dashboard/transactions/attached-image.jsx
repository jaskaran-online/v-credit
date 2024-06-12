import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useRef } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ENV } from '../../../../env.config';

export default function AttachedImage(props) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useRef(1);
  const lastOffset = { x: 0, y: 0 };

  const onPinchEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = lastScale.current * event.scale;
    },
    onEnd: () => {
      lastScale.current = scale.value;
    },
  });

  const onPanEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = lastOffset.x + event.translationX;
      translateY.value = lastOffset.y + event.translationY;
    },
    onEnd: () => {
      lastOffset.x = translateX.value;
      lastOffset.y = translateY.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const zoomIn = () => {
    scale.value = withTiming(Math.min(scale.value * 1.2, 5));
    lastScale.current = scale.value;
  };

  const zoomOut = () => {
    scale.value = withTiming(Math.max(scale.value / 1.2, 1));
    lastScale.current = scale.value;
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onPanEvent}>
        <Animated.View style={styles.imageContainer}>
          <PinchGestureHandler onGestureEvent={onPinchEvent}>
            <Animated.View style={animatedStyle}>
              <Image
                source={{
                  uri: `${ENV.PRO}${props.route.params.image}`,
                }}
                resizeMode="contain"
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                }}
              />
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <BlurView style={styles.buttonContainer} intensity={40}>
        <Button onPress={zoomIn} mode="text">
          <Feather name="zoom-in" size={20} color="dodgerblue" />
          <Text variant="bodyLarge" className="font-medium text-blue-500">
            Zoom In
          </Text>
        </Button>
        <Button onPress={zoomOut} mode="text">
          <Feather name="zoom-out" size={20} color="dodgerblue" />
          <Text variant="bodyLarge" className="font-medium text-blue-500">
            Zoom Out
          </Text>
        </Button>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    flex: 9,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
