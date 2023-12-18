import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

function CardComponent({ title, iconName, description, onPress = () => null }) {
  return (
    <TouchableOpacity
      className="mx-2 mt-3 flex h-16 flex-row items-center justify-between rounded-2xl bg-white px-4 shadow-sm shadow-slate-200"
      onPress={onPress}>
      <View className="flex flex-row items-center justify-start">
        <View>
          {iconName === 'bank' ? (
            <MaterialCommunityIcons name="bank-transfer" size={24} color="dodgerblue" />
          ) : (
            <Ionicons name={iconName} size={20} color="dodgerblue" />
          )}
        </View>
        <View className="ml-4">
          <Text variant="titleSmall">{title}</Text>
        </View>
      </View>
      <View className="rounded-full bg-blue-100 p-2">
        <AntDesign name="right" size={18} color="dodgerblue" />
      </View>
    </TouchableOpacity>
  );
}

export default function Index({ navigation }) {
  return (
    <View className="flex-1 justify-start bg-blue-50">
      <CardComponent
        onPress={() => {
          navigation.navigate('Purchase');
        }}
        iconName="person"
        title="Purchase"
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('Balance');
        }}
        iconName="people"
        title="Balance"
      />
    </View>
  );
}
