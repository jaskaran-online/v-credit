import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useCustomersStore } from '../index';
import { FlashList } from '@shopify/flash-list';
import { isUndefined } from 'lodash';

export const sendWhatsAppMessage = (link) => {
  if (!isUndefined(link)) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            'Please install whats app to send direct message to students via whatsapp',
          );
        } else {
          return Linking.openURL(link);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  } else {
    console.log('sendWhatsAppMessage -----> ', 'message link is undefined');
  }
};

function processString(input = null) {
  if (input == null || input === '' || input === 'null') {
    return '';
  }
  // Remove "-", ",", and spaces from the string
  let processedString = input.replace(/[-,\s]/g, '');

  // If the resulting string has a length greater than 10, remove the first three letters
  if (processedString.length > 10) {
    processedString = processedString.substring(3);
  }

  return processedString;
}

const makePhoneCall = (phoneNumber) => {
  const url = `tel:${processString(phoneNumber)}`;
  Linking.canOpenURL(url)
    .then(() => {
      return Linking.openURL(url);
    })
    .catch((error) => console.error(error));
};

function CardComponent({
  title,
  iconName,
  description,
  makeCall = () => null,
  whatsapp = () => null,
}) {
  return (
    <View
      className={
        'bg-white flex h-16 shadow-sm shadow-slate-200 mx-2 flex-row justify-between items-center px-4 mt-2 rounded-2xl'
      }
    >
      <View className={'flex flex-row justify-start items-center'}>
        <View>
          {iconName === 'bank' ? (
            <MaterialCommunityIcons
              name='bank-transfer'
              size={24}
              color='dodgerblue'
            />
          ) : (
            <Ionicons name={iconName} size={20} color='dodgerblue' />
          )}
        </View>
        <View className={'ml-4'}>
          <Text variant={'titleSmall'}>{title}</Text>
          <Text variant={'bodySmall'} className={'text-slate-500'}>
            {description}
          </Text>
        </View>
      </View>
      <View className={'flex flex-row gap-4'}>
        <TouchableOpacity
          className='bg-blue-100 p-2 rounded-full'
          onPress={makeCall}
        >
          <MaterialCommunityIcons name='phone' size={18} color='dodgerblue' />
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-emerald-50 p-2 rounded-full'
          onPress={whatsapp}
        >
          <MaterialCommunityIcons name='whatsapp' size={18} color='darkgreen' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Index({ navigation }) {
  const customerList = useCustomersStore((state) => state.customersList);
  return (
    <View className='flex-1 justify-start bg-blue-50'>
      <FlashList
        data={customerList}
        renderItem={({ item, index }) => (
          <CardComponent
            key={index}
            title={item.name}
            iconName='person'
            description={item.digits}
            makeCall={() => makePhoneCall(item.digits)}
            estimateItemSize={150}
            whatsapp={() =>
              sendWhatsAppMessage(`https://wa.me/91${item.digits}?text=Hello`)
            }
          />
        )}
      />
    </View>
  );
}
