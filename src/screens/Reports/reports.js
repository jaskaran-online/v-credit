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
          <Text variant="bodySmall" className="text-slate-500">
            {description}
          </Text>
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
          navigation.navigate('DayBook');
        }}
        iconName="calendar"
        title="Day Book"
        description="All Transactions for any report"
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('Party');
        }}
        iconName="person"
        title="Party Statement"
        description="Txn of any party between and duration"
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('AllParty');
        }}
        iconName="people"
        title="All Parties"
        description="All Your Parties and their amounts"
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('AllTransactions');
        }}
        iconName="bank"
        title="All Transactions"
        description="All Transactions between any duration"
      />
      <CardComponent
        onPress={() => {
          navigation.navigate('CostCenter');
        }}
        iconName="home"
        title="Cost Centre Wise Profit "
        description="Transaction all debit and credit "
      />
    </View>
  );
}
