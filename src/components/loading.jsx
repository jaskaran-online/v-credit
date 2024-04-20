import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS } from '../core';

function Loading() {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <LottieView
        autoPlay
        ref={animation}
        style={styles.lottieAnimation}
        source={require('../../assets/loading.json')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottieAnimation: {
    backgroundColor: COLORS.white,
    height: 200,
    width: 200,
  },
});

export default Loading;
