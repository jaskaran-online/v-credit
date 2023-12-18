import { View } from 'react-native';
import { Text } from 'react-native-paper';

const EmptyList = () => (
  <View className="d-flex h-16 flex-1 items-center justify-center">
    <Text variant="bodyMedium">No Records Available!</Text>
  </View>
);

export default EmptyList;
