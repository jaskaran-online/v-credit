import { Linking, Share, TouchableOpacity, View } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import React, { useState } from 'react';
import { Chip, Text } from 'react-native-paper';
import navigation from '../navigations';
import { create } from 'zustand';
import Toast from 'react-native-toast-message';

const SecureStore = createSecureStore();

/**
 * Retrieves an item from the SecureStore given a key.
 *
 * @param {string} key - The key to identify the item.
 * @return {Promise<any>} Returns a Promise that resolves to the item value, or null if the item does not exist.
 */
export async function getItem(key) {
  const value = await SecureStore.getItem(key);
  return value ? JSON.parse(value) : null;
}

/**
 * Sets a key-value pair in SecureStore.
 *
 * @param {string} key - The key to set in SecureStore.
 * @param {any} value - The value to set for the given key.
 * @return {Promise<void>} - A promise that resolves when the key-value pair is set in SecureStore.
 */
export async function setItem(key, value) {
  await SecureStore.setItem(key, JSON.stringify(value));
}

/**
 * Removes the item with the specified key from the SecureStore.
 *
 * @param {string} key - The key of the item to be removed.
 * @return {Promise<void>} A promise that resolves when the item has been successfully removed.
 */
export async function removeItem(key) {
  await SecureStore.removeItem(key);
}

/**
 * Opens a link in the default browser.
 *
 * @param {string} url - The URL to open in the browser.
 * @return {void} This function does not return anything.
 */
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

/**
 * Checks if the given date is today.
 *
 * @param {string} dateString - The date to check in string format.
 * @return {boolean} Returns true if the given date is today, otherwise false.
 */
export const isToday = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  return (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getDate() === inputDate.getDate()
  );
};

export function convertTimeToPM(timeStr) {
  // Convert the time string to a Date object.
  const time = new Date(timeStr);

  // Get the hour and minute.
  const hour = time.getHours();
  const minute = time.getMinutes();

  // Convert the hour to 12-hour format.
  let pmHour = hour;
  if (pmHour >= 12) {
    pmHour -= 12;
  }

  // Add leading zeros to hour and minute if needed.
  const formattedHour = pmHour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  // Add the AM/PM suffix.
  const suffix = pmHour >= 12 ? 'PM' : 'AM';

  // Return the formatted time string.
  return `${formattedHour}:${formattedMinute} ${suffix}`;
}

/**
 * Formats a given date for displaying in a message.
 *
 * @param {string|number|Date} inputDate - The date to be formatted. It can be a string, number, or Date object.
 * @return {string} The formatted date in the format "ddth MonthName yyyy", where "dd" is the day with an ordinal suffix, "MonthName" is the full name of the month, and "yyyy" is the year.
 */
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

/**
 * Render a row component for displaying a transaction.
 *
 * @param {Object} transaction - The transaction object.
 * @param {number} index - The index of the transaction.
 * @param {string} userId - The ID of the user.
 * @param {boolean} isAdmin - Flag indicating if the user is an admin.
 * @param {boolean} showDelete - Flag indicating if the delete button should be shown.
 * @param {function} onDelete - Function to handle the delete action.
 * @param {boolean} showPDF - Flag indicating if the PDF button should be shown.
 * @param {boolean} showCustomerName - Flag indicating if the customer name should be shown.
 * @return {JSX.Element} The rendered row component.
 */
const Row = ({
  transaction,
  index,
  userId,
  isAdmin,
  showDelete,
  onDelete,
  showPDF = false,
  showCustomerName,
}) => {
  const [expanded, setExpanded] = useState(false);

  let message;
  let balance = parseFloat(transaction?.customer?.balance);
  let balanceType = transaction?.customer?.balance_type;
  let isEditableOrDeleteable =
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
    setExpanded((expanded) => !expanded);
    // if (balanceType !== 'clear' || isEditableOrDeleteable) {
    // }
  };

  let isEven = index % 2 === 0 ? 'bg-slate-50' : 'bg-white';

  return (
    <>
      <TouchableOpacity
        className={`${isEven} flex flex-row justify-between px-4 py-2`}
        key={index}
        onPress={handleListExpand}
      >
        <View className="flex flex-row items-center w-1/4">
          <View className="mr-1">
            {transaction?.transaction_type_id === 2 ? (
              <MaterialCommunityIcons
                name="call-received"
                size={14}
                color="green"
              />
            ) : (
              <MaterialIcons name="call-made" size={14} color="red" />
            )}
          </View>
          <View>
            {showCustomerName ? (
              <Text variant={'titleSmall'} className="text-slate-800">
                {transaction?.customer?.name}
              </Text>
            ) : (
              <Text variant={'titleSmall'} className="text-slate-800">
                {transaction?.transaction_type_id == 2 ? 'Credit' : 'Debit'}
              </Text>
            )}

            <Text variant={'labelSmall'} className="text-slate-400">
              {formatDateForMessage(transaction?.date)}
            </Text>
          </View>
        </View>
        <View>
          {transaction?.transaction_type_id === 1 ? (
            <View className={'mr-2'}>
              <Text variant={'bodySmall'} className="text-slate-800 mr-2">
                {parseFloat(transaction?.amount).toFixed(2)} ₹
              </Text>
              <Text variant={'labelSmall'} className="text-slate-400 mr-2">
                (Udhaar)
              </Text>
            </View>
          ) : (
            <Text
              variant={'bodySmall'}
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
                <Text variant={'bodySmall'} className="text-slate-800">
                  {parseFloat(transaction?.amount).toFixed(2)} ₹
                </Text>
                <Text variant={'labelSmall'} className="text-slate-400">
                  (Payment)
                </Text>
              </View>
            ) : (
              <Text
                variant={'bodySmall'}
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
            color="lightgray"
            style={{ marginRight: 5, paddingTop: 5 }}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <>
          {isAdmin && (
            <React.Fragment>
              {transaction.notes && (
                <View className="bg-blue-50 w-auto h-auto px-3 py-2">
                  <Chip
                    mode="flat"
                    // icon="information"
                    onPress={() => console.log('Pressed')}
                    className={'bg-white'}
                  >
                    <Text variant="labelSmall">Note : {transaction.notes}</Text>
                  </Chip>
                </View>
              )}
              <View
                key={index}
                className={`h-12 bg-blue-50 flex flex-row justify-end gap-2 items-center pb-2 px-2`}
              >
                <Chip
                  mode="flat"
                  icon="information"
                  onPress={() => console.log('Pressed')}
                  className={'bg-white'}
                >
                  <Text variant="labelSmall">
                    {transaction?.user?.name}{' '}
                    {userId === transaction?.user_id ? '(You)' : ''}
                  </Text>
                </Chip>
                <Chip
                  mode="flat"
                  icon="clock"
                  onPress={() => console.log('Pressed')}
                  className={'bg-white'}
                >
                  <Text variant="labelSmall">
                    {convertTimeToPM(transaction?.date)}
                  </Text>
                </Chip>
              </View>
            </React.Fragment>
          )}
          <View
            className={
              'bg-blue-50 h-14 flex-row flex py-3 justify-evenly items-center px-4'
            }
          >
            {(isEditableOrDeleteable || isAdmin) && (
              <>
                <TouchableOpacity
                  className="flex items-center gap-1"
                  onPress={
                    isEditableOrDeleteable || isAdmin
                      ? () =>
                          navigation.navigate('EditTransaction', {
                            transaction: transaction,
                          })
                      : () => null
                  }
                >
                  <MaterialIcons name="edit" size={20} color="dodgerblue" />
                  <Text variant={'labelSmall'} className="text-slate-800">
                    Edit
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {showPDF && (
              <TouchableOpacity
                className="flex items-center gap-1"
                onPress={() =>
                  navigation.navigate('DetailsPdf', {
                    id: transaction.customer?.id,
                    name: transaction.customer?.name,
                  })
                }
              >
                <MaterialIcons name="picture-as-pdf" size={22} color="tomato" />
                <Text variant={'labelSmall'} className="text-slate-800">
                  PDF
                </Text>
              </TouchableOpacity>
            )}

            {balanceType !== 'clear' && (
              <TouchableOpacity
                className="flex items-center gap-1"
                onPress={async () => {
                  await Share.share({
                    message: message,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={22}
                  color="green"
                />
                <Text variant={'labelSmall'} className="text-slate-800">
                  Share
                </Text>
              </TouchableOpacity>
            )}

            {(isEditableOrDeleteable || isAdmin) && showDelete && (
              <TouchableOpacity
                className="flex items-center gap-1"
                onPress={
                  (isToday(transaction?.created_at) &&
                    transaction?.user_id === userId) ||
                  isAdmin
                    ? () => onDelete(transaction)
                    : () => null
                }
              >
                <MaterialIcons name="delete" size={20} color="red" />
                <Text variant={'labelSmall'} className="text-slate-800">
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </>
  );
};

/**
 * Renders and returns a React component that represents a transaction item.
 *
 * @param {Object} options - An object containing the following properties:
 *   - {Object} item: The transaction item to be rendered.
 *   - {number} index: The index of the transaction item.
 *   - {string} userId: The ID of the user.
 *   - {boolean} isAdmin: Indicates whether the user is an admin.
 *   - {boolean} showDelete: Indicates whether to show the delete button (default: false).
 *   - {function} onDelete: A callback function that will be called when the delete button is clicked (default: console.log).
 *   - {boolean} showPDF: Indicates whether to show the PDF button (default: false).
 *   - {boolean} showCustomerName: Indicates whether to show the customer name (default: true).
 * @return {JSX.Element} A React component representing the transaction item.
 */
export const renderItem = ({
  item: transaction,
  index,
  userId,
  isAdmin,
  showDelete = false,
  onDelete = (item) => {
    console.log('Delete Item', item);
  },
  showPDF = false,
  showCustomerName = true,
}) => {
  return (
    <Row
      transaction={transaction}
      userId={userId}
      index={index}
      isAdmin={isAdmin}
      showDelete={showDelete}
      onDelete={onDelete}
      showPDF={showPDF}
      showCustomerName={showCustomerName}
    />
  );
};

/**
 * Renders the header component.
 *
 * @param {object} headerTitle - The title of the header.
 * @return {JSX.Element} The rendered header component.
 */
export const renderHeader = ({ headerTitle }) => (
  <View className={'flex-row justify-between px-4 py-2 space-x-2 items-center'}>
    <View className="flex-1 border-b-2 border-slate-300 w-1/3">
      <Text variant={'bodySmall'} className="text-left text-slate-800">
        {headerTitle !== '' ? 'Customer' : 'Type'}
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-amber-400">
      <Text variant={'bodySmall'} className="text-center text-slate-800 mr-2">
        Given
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-blue-500">
      <Text variant={'bodySmall'} className="text-center text-slate-800">
        Received
      </Text>
    </View>
  </View>
);

export const useAuthCompanyStore = create((set) => ({
  selectedCompany: null,
  setCompany: (newState) => set((state) => ({ selectedCompany: newState })),
}));

/**
 * Displays a toast message with the given message and type.
 *
 * @param {string} message - The message to display in the toast.
 * @param {string} type - The type of toast to display ('success' or 'error').
 * @return {void}
 */
export const showToast = (message = '', type = 'success') => {
  const toastType = type === 'success' ? 'Success' : 'Error';
  const position = 'bottom';

  Toast.show({
    type,
    text1: toastType,
    text2: message,
    position,
  });
};

/**
 * Processes a string by removing "-", ",", and spaces from it. If the resulting string has a length greater than 10, it removes the first three letters.
 *
 * @param {null} str - The input string to be processed.
 * @return {string} The processed string.
 */
export const processString = (str = null) => {
  if (str === null || str === '') return '';

  const processedString = str.replace(/[-,\s]/g, '');
  const [, , ...remainingLetters] = processedString;

  return remainingLetters.length > 11
    ? remainingLetters.join('')
    : processedString;
};

/**
 * Converts a given date string to the format "YYYY-MM-DD HH:MM:SS".
 *
 * @param {string} dateString - The date string to be converted.
 * @return {string} The converted date string in the format "YYYY-MM-DD HH:MM:SS".
 */
export const convertDateFormat = (dateString) => {
  const dateObj = new Date(dateString);

  const convertedDate = dateObj.toISOString().slice(0, 10).replace('T', ' ');
  const convertedTime = dateObj.toISOString().slice(11, 19);

  return `${convertedDate} ${convertedTime}`;
};

// Create Zustand stores
export const useContactsStore = create((set) => ({
  contactsList: [],
  setContacts: (newState) => set({ contactsList: newState }),
}));

export const useCustomersStore = create((set) => ({
  customersList: [],
  setCustomers: (newState) => set({ customersList: newState }),
}));
export const useFilterToggleStore = create((set) => ({
  filterBy: 'none',
  toggleFilter: (newState) => set((state) => ({ filterBy: newState })),
}));

export const useCardAmountStore = create((set) => ({
  cardAmount: {
    toReceive: 0,
    toPay: 0,
  },
  setCardAmount: (newState) => set((state) => ({ cardAmount: newState })),
}));
