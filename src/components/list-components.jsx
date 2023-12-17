import { MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { BALANCE, DUE } from '../core/constants';
import { convertTimeToPM, formatDateForMessage, isToday } from '../core/utils';
import navigation from '../navigations';

/**
 * Renders the header component.
 *
 * @param {object} headerTitle - The title of the header.
 * @return {JSX.Element} The rendered header component.
 */
export const renderHeader = ({ headerTitle }) => (
  <View className="flex-row items-center justify-between space-x-2 px-4 py-2">
    <View className="w-1/3 flex-1 border-b-2 border-slate-300">
      <Text variant="bodySmall" className="text-left text-slate-800">
        {headerTitle !== '' ? 'Customer' : 'Type'}
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-amber-400">
      <Text variant="bodySmall" className="mr-2 text-center text-slate-800">
        Given
      </Text>
    </View>
    <View className="flex-1 border-b-2 border-blue-500">
      <Text variant="bodySmall" className="text-center text-slate-800">
        Received
      </Text>
    </View>
  </View>
);

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
  const balance = parseFloat(transaction?.customer?.balance);
  const balanceType = transaction?.customer?.balance_type;
  const isEditableOrDeleteable =
    isToday(transaction?.created_at) && transaction?.user_id === userId;
  const dateFormatted = formatDateForMessage(transaction?.date);
  if (transaction?.transaction_type_id === DUE) {
    message = `Hi ${transaction?.customer?.name},
        
I received payment of ${parseFloat(transaction?.amount).toFixed(2)} ₹ on ${dateFormatted} from you.
Total Balance: ${Math.abs(balance).toFixed(2)} ₹ ${balanceType}.
    
Thanks,
${transaction?.user?.name}
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${transaction?.customer?.id}-${transaction?.user_id}`;
  } else {
    message = `Hi ${transaction?.customer?.name},
        
I gave you credit of ${parseFloat(transaction?.amount).toFixed(2)} ₹ on ${dateFormatted}.
Total Balance: ${Math.abs(balance).toFixed(2)} ₹ ${balanceType}.

Thanks,
${transaction?.user?.name}
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${transaction?.customer?.id}-${transaction?.user_id}`;
  }
  const handleListExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  const isEven = index % 2 === 0 ? 'bg-slate-50' : 'bg-white';

  return (
    <>
      <TouchableOpacity
        className={`${isEven} flex flex-row justify-between px-4 py-2`}
        key={index}
        onPress={handleListExpand}>
        <View className="flex w-1/4 flex-row items-center">
          <View className="mr-1">
            {transaction?.transaction_type_id === DUE ? (
              <MaterialCommunityIcons name="call-received" size={14} color="green" />
            ) : (
              <MaterialIcons name="call-made" size={14} color="red" />
            )}
          </View>
          <View>
            {showCustomerName ? (
              <Text variant="titleSmall" className="text-slate-800">
                {transaction?.customer?.name}
              </Text>
            ) : (
              <Text variant="titleSmall" className="text-slate-800">
                {transaction?.transaction_type_id === DUE ? 'Credit' : 'Debit'}
              </Text>
            )}

            <Text variant="labelSmall" className="text-slate-400">
              {formatDateForMessage(transaction?.date)}
            </Text>
          </View>
        </View>
        <View>
          {transaction?.transaction_type_id === BALANCE ? (
            <View className="mr-2">
              <Text variant="bodySmall" className="mr-2 text-slate-800">
                {parseFloat(transaction?.amount).toFixed(2)} ₹
              </Text>
              <Text variant="labelSmall" className="mr-2 text-slate-400">
                (Udhaar)
              </Text>
            </View>
          ) : (
            <Text variant="bodySmall" className="text-center text-slate-400">
              {' '}
              -{' '}
            </Text>
          )}
        </View>
        <View className="items-right flex flex-row">
          <View className="mr-8 flex flex-row items-center">
            {transaction?.transaction_type_id === DUE ? (
              <View>
                <Text variant="bodySmall" className="text-slate-800">
                  {parseFloat(transaction?.amount).toFixed(2)} ₹
                </Text>
                <Text variant="labelSmall" className="text-slate-400">
                  (Payment)
                </Text>
              </View>
            ) : (
              <Text variant="bodySmall" className="text-center text-slate-400">
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
        <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
          {isAdmin && (
            <>
              {transaction.notes && (
                <View className="h-auto w-auto bg-blue-50 px-3 py-2">
                  <Chip
                    mode="flat"
                    // icon="information"
                    onPress={() => console.log('Pressed')}
                    className="bg-white">
                    <Text variant="labelSmall">Note : {transaction.notes}</Text>
                  </Chip>
                </View>
              )}
              <View
                key={index}
                className="flex h-12 flex-row items-center justify-end gap-2 bg-blue-50 px-2 pb-2">
                <Chip
                  mode="flat"
                  icon="information"
                  onPress={() => console.log('Pressed')}
                  className="bg-white">
                  <Text variant="labelSmall">
                    {transaction?.user?.name} {userId === transaction?.user_id ? '(You)' : ''}
                  </Text>
                </Chip>
                <Chip
                  mode="flat"
                  icon="clock"
                  onPress={() => console.log('Pressed')}
                  className="bg-white">
                  <Text variant="labelSmall">{convertTimeToPM(transaction?.date)}</Text>
                </Chip>
              </View>
            </>
          )}
          <View className="flex h-14 flex-row items-center justify-evenly bg-blue-50 px-4 py-3">
            {(isEditableOrDeleteable || isAdmin) && (
              <>
                <TouchableOpacity
                  className="flex items-center gap-1"
                  onPress={
                    isEditableOrDeleteable || isAdmin
                      ? () =>
                          navigation.navigate('EditTransaction', {
                            transaction,
                          })
                      : () => null
                  }>
                  <MaterialIcons name="edit" size={20} color="dodgerblue" />
                  <Text variant="labelSmall" className="text-slate-800">
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
                }>
                <MaterialIcons name="picture-as-pdf" size={22} color="tomato" />
                <Text variant="labelSmall" className="text-slate-800">
                  PDF
                </Text>
              </TouchableOpacity>
            )}

            {balanceType !== 'clear' && (
              <TouchableOpacity
                className="flex items-center gap-1"
                onPress={async () => {
                  await Share.share({
                    message,
                  });
                }}>
                <MaterialCommunityIcons name="whatsapp" size={22} color="green" />
                <Text variant="labelSmall" className="text-slate-800">
                  Share
                </Text>
              </TouchableOpacity>
            )}

            {(isEditableOrDeleteable || isAdmin) && showDelete && (
              <TouchableOpacity
                className="flex items-center gap-1"
                onPress={
                  (isToday(transaction?.created_at) && transaction?.user_id === userId) || isAdmin
                    ? () => onDelete(transaction)
                    : () => null
                }>
                <MaterialIcons name="delete" size={20} color="red" />
                <Text variant="labelSmall" className="text-slate-800">
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </>
  );
};
