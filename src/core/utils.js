import { Linking, Share, TouchableOpacity, View } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import navigation from '../navigations';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import React, { useState } from 'react';

const SecureStore = createSecureStore();

export async function getItem(key) {
  const value = await SecureStore.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem(key, value) {
  await SecureStore.setItem(key, JSON.stringify(value));
}

export async function removeItem(key) {
  await SecureStore.removeItem(key);
}

export function openLinkInBrowser(url) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export const createSelectors = (_store) => {
  let store = _store;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    store.use[k] = () => store((s) => s[k]);
  }
  return store;
};

export const isToday = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  return (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getDate() === inputDate.getDate()
  );
};

export function formatDateForMessage(inputDate) {
  const date = new Date(inputDate);

  // Function to get the ordinal suffix for the day (e.g., 1st, 2nd, 3rd, 4th, etc.)
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Get day, month, and year from the Date object
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Array of month names to get the month's name from its index
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Format the date as "dd MMMM yyyy"
  return `${day}${getOrdinalSuffix(day)} ${monthNames[monthIndex]} ${year}`;
}

const Row = ({ transaction, index, userId }) => {
  const [expanded, setExpanded] = useState(false);

  let message;
  let balance = parseFloat(transaction?.customer?.balance);
  let balanceType = transaction?.customer?.balance_type;
  let isEditable =
    isToday(transaction?.created_at) && transaction?.user_id === userId;
  let dateFormatted = formatDateForMessage(transaction?.date);
  if (transaction?.transaction_type_id === 2) {
    message = `Hi ${transaction?.customer?.name},
        
I received payment of ${parseFloat(transaction?.amount).toFixed(
      2,
    )} ₹ on ${dateFormatted} from you.
Total Balance: ${Math.abs(balance).toFixed(2)} ₹ ${balanceType}.
    
Thanks,
${transaction?.user?.name}
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${transaction?.customer?.id}-${
      transaction?.user_id
    }`;
  } else {
    message = `Hi ${transaction?.customer?.name},
        
I gave you credit of ${parseFloat(transaction?.amount).toFixed(
      2,
    )} ₹ on ${dateFormatted}.
Total Balance: ${Math.abs(balance).toFixed(2)} ₹ ${balanceType}.

Thanks,
${transaction?.user?.name}
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${transaction?.customer?.id}-${
      transaction?.user_id
    }`;
  }
  const handleListExpand = () => {
    if (balanceType !== 'clear' || isEditable) {
      setExpanded(!expanded);
    }
  };

  let color;
  let isEven = index % 2 === 0 ? (color = 'bg-slate-50') : (color = 'bg-white');

  return (
    <>
      <TouchableOpacity
        className={`${isEven} flex flex-row justify-between px-4 py-2`}
        key={index}
        onPress={handleListExpand}
      >
        <View className='flex flex-row items-center w-1/4'>
          <View className='mr-1'>
            {transaction?.transaction_type_id === 2 ? (
              <MaterialCommunityIcons
                name='call-received'
                size={14}
                color='green'
              />
            ) : (
              <MaterialIcons name='call-made' size={14} color='red' />
            )}
          </View>
          <View>
            <Text variant={'titleSmall'} className='text-slate-800'>
              {transaction?.customer?.name}
            </Text>
            <Text variant={'labelSmall'} className='text-slate-400'>
              {formatDateForMessage(transaction?.date)}
            </Text>
          </View>
        </View>
        <View>
          {transaction?.transaction_type_id === 1 ? (
            <View className={'mr-2'}>
              <Text variant={'bodyMedium'} className='text-slate-800 mr-2'>
                {parseFloat(transaction?.amount).toFixed(2)}
              </Text>
              <Text variant={'labelSmall'} className='text-slate-400 mr-2'>
                (Udhaar)
              </Text>
            </View>
          ) : (
            <Text
              variant={'bodyMedium'}
              className={'text-slate-400 text-center'}
            >
              {' '}
              -{' '}
            </Text>
          )}
        </View>
        <View className={'flex flex-row items-right'}>
          <View className={'flex flex-row items-center mr-8'}>
            {transaction?.transaction_type_id === 2 ? (
              <View>
                <Text variant={'bodyMedium'} className='text-slate-800'>
                  {parseFloat(transaction?.amount).toFixed(2)}
                </Text>
                <Text variant={'labelSmall'} className='text-slate-400'>
                  (Payment)
                </Text>
              </View>
            ) : (
              <Text
                variant={'bodyMedium'}
                className={'text-slate-400 text-center'}
              >
                {' '}
                -{' '}
              </Text>
            )}
          </View>
          <Octicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color='lightgray'
            style={{ marginRight: 5, paddingTop: 5 }}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View
          className={
            'bg-blue-50 h-14 flex-row flex py-3 justify-end px-5 items-center gap-x-5'
          }
        >
          {isEditable && (
            <>
              <TouchableOpacity
                className='flex items-center gap-1'
                onPress={
                  isToday(transaction?.created_at) &&
                  transaction?.user_id === userId
                    ? () =>
                        navigation.navigate('EditTransaction', {
                          transaction: transaction,
                        })
                    : () => null
                }
              >
                <MaterialIcons name='edit' size={20} color='dodgerblue' />
                <Text variant={'labelSmall'} className='text-slate-800'>
                  Edit
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            className='flex items-center gap-1'
            onPress={() =>
              navigation.navigate('DetailsPdf', {
                id: transaction.customer?.id,
                name: transaction.customer?.name,
              })
            }
          >
            <MaterialIcons name='picture-as-pdf' size={22} color='tomato' />
            <Text variant={'labelSmall'} className='text-slate-800'>
              PDF
            </Text>
          </TouchableOpacity>

          {balanceType !== 'clear' && (
            <TouchableOpacity
              className='flex items-center gap-1'
              onPress={async () => {
                await Share.share({
                  message: message,
                });
              }}
            >
              <MaterialCommunityIcons name='whatsapp' size={22} color='green' />
              <Text variant={'labelSmall'} className='text-slate-800'>
                Share
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export const renderItem = ({ item: transaction, index, userId }) => {
  return <Row transaction={transaction} userId={userId} index={index} />;
};

export const renderHeader = () => (
  <View className={'flex-row justify-between px-4 py-2 space-x-2 items-center'}>
    <View className='flex-1 border-b-2 border-slate-300 w-1/3'>
      <Text variant={'bodyMedium'} className='text-left text-slate-800'>
        Customer
      </Text>
    </View>
    <View className='flex-1 border-b-2 border-amber-400'>
      <Text variant={'bodyMedium'} className='text-center text-slate-800 mr-2'>
        Given
      </Text>
    </View>
    <View className='flex-1 border-b-2 border-blue-500'>
      <Text variant={'bodyMedium'} className='text-center text-slate-800'>
        Received
      </Text>
    </View>
  </View>
);
