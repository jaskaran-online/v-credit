import { AntDesign, Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { COLORS } from '../core';

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useSharedValue(0);

  const toggle = () => {
    setIsOpen(!isOpen);
    animatedHeight.value = isOpen ? 0 : 1; // Toggle the shared value between 0 and 1
  };

  const getHeightStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(isOpen ? animatedHeight.value * 150 : 0), // Adjust the height value as needed
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.header}>
        <View className="py-1 pb-4 flex flex-row items-center gap-x-2">
          <AntDesign name="setting" size={22} color={COLORS.darkTransparent} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: COLORS.darkTransparent,
            }}>
            {title}
          </Text>
        </View>
        <Animated.View
          style={[styles.icon, { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }]}>
          {isOpen ? (
            <Entypo name="chevron-small-down" size={24} color="black" />
          ) : (
            <Entypo name="chevron-small-down" size={24} color="black" />
          )}
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.content, getHeightStyle]}>{isOpen && children}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    padding: 10,
    paddingTop: 15,
  },
  content: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
});

export default AccordionItem;
