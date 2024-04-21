import { View } from 'react-native';
import { Text } from 'react-native-paper';

const TextMedium = ({ variant, className, children, fontSize }) => {
  return (
    <View>
      <Text
        variant={variant}
        className={className}
        style={{
          fontFamily: 'sans-serif-medium',
        }}>
        {children}
      </Text>
    </View>
  );
};

export default TextMedium;
