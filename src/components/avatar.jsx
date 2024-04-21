import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const randomDarkColor = () => {
  const randomChannel = () => {
    const channel = Math.floor(Math.random() * 155); // Adjust this value for darkness
    return channel.toString(16).padStart(2, '0');
  };

  const red = randomChannel();
  const green = randomChannel();
  const blue = randomChannel();

  return `#${red}${green}${blue}`;
};

const Avatar = ({
  name = 'User',
  color = randomDarkColor(),
  size,
  fontStyle = {},
  containerStyle = {},
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);
  return (
    <View
      className="flex items-center justify-center rounded-full "
      style={[
        {
          backgroundColor: color,
          height: size,
          width: size,
        },
        containerStyle,
      ]}>
      <Text
        className="text-white"
        variant="labelLarge"
        style={[
          {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: size / 2.8,
          },
          fontStyle,
        ]}>
        {initials}
      </Text>
    </View>
  );
};

export default memo(Avatar);
