import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';


function CardComponent({ title, iconName, description, onPress = () => null }) {
  return (
    <TouchableOpacity
      className={
        'bg-white flex h-16 shadow-sm shadow-slate-200 mx-2 flex-row justify-between items-center px-4 mt-3 rounded-2xl'
      }
      onPress={onPress}
    >
      <View className={'flex flex-row justify-start items-center'}>
        <View>
          {iconName === 'bank' ? (
            <MaterialCommunityIcons
              name="bank-transfer"
              size={24}
              color="dodgerblue"
            />
          ) : (
            <Ionicons name={iconName} size={20} color="dodgerblue" />
          )}
        </View>
        <View className={'ml-4'}>
          <Text variant={'titleSmall'}>{title}</Text>
        </View>
      </View>
      <View className="bg-blue-100 p-2 rounded-full">
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
        title={'Purchase'}
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('Balance');
        }}
        iconName="people"
        title={'Balance'}
      />
    </View>
  );
}
