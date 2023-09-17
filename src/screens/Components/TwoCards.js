import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useCardAmountStore, useFilterToggleStore } from '../../core/utils';

const StyledView = styled(TouchableOpacity);

const Box = ({ className, children, onPress, ...props }) => (
  <StyledView
    onPress={onPress}
    className={`flex text-center h-20 rounded-md ₹{className}`}
    {...props}
  >
    {children}
  </StyledView>
);

export function TwoCards({
  toReceive: propToReceive = 0,
  toPay: propToPay = 0,
  homePage = false,
}) {
  let toggleFilter = useFilterToggleStore((state) => state.toggleFilter);
  let cardAmount = useCardAmountStore((state) => state.cardAmount);
  const [filterByToReceive, setFilterByToReceive] = useState(false);
  const [filterByToPay, setFilterByToPay] = useState(false);

  const handleToPayClick = () => {
    setFilterByToPay(() => !filterByToPay);
    if (!filterByToPay) {
      toggleFilter('toPay');
    } else {
      toggleFilter('none');
    }
  };

  const handleToReceiveClick = () => {
    setFilterByToReceive(() => !filterByToReceive);
    if (!filterByToReceive) {
      toggleFilter('toReceive');
    } else {
      toggleFilter('none');
    }
  };

  useEffect(() => {
    if (filterByToReceive === true) {
      setFilterByToPay(() => !filterByToReceive);
    }
  }, [filterByToReceive]);

  useEffect(() => {
    if (filterByToPay === true) {
      setFilterByToReceive(() => !filterByToPay);
    }
  }, [filterByToPay]);

  return (
    <StyledView className="flex flex-row items-center p-2 space-x-2 h-1/8 bg-blue-50">
      <Box
        className={` ${
          filterByToReceive ? 'bg-emerald-500' : 'bg-white'
        } flex-row items-center flex-1 shadow-sm shadow-slate-200 justify-evenly`}
        onPress={handleToReceiveClick}
      >
        <View
          className={` ${
            filterByToReceive ? 'bg-white' : 'bg-emerald-600'
          } p-1 rounded-full h-[40px] w-[40px] justify-center items-center`}
        >
          <MaterialCommunityIcons
            name="call-received"
            size={20}
            color={`${filterByToReceive ? 'green' : 'white'}`}
          />
        </View>
        <View>
          <Text
            variant={'bodyMedium'}
            className={`${
              filterByToReceive ? 'text-slate-100' : 'text-slate-500'
            }`}
          >
            To Receive
          </Text>
          <Text
            variant={'titleMedium'}
            className={`${
              filterByToReceive ? 'text-white' : 'text-slate-700'
            } font-bold `}
          >
            {homePage
              ? Math.abs(parseFloat(cardAmount?.toReceive).toFixed(2))
              : propToReceive
              ? Math.abs(parseFloat(propToReceive).toFixed(2))
              : 0}{' '}
            ₹
          </Text>
        </View>
      </Box>
      <Box
        className={`${
          filterByToPay ? 'bg-red-600' : 'bg-white'
        } flex-row items-center flex-1 shadow-sm shadow-slate-200 justify-evenly`}
        onPress={handleToPayClick}
      >
        <View
          className={`${
            filterByToPay ? 'bg-white' : 'bg-red-500'
          } p-1 rounded-full h-[40px] w-[40px] justify-center items-center`}
        >
          <MaterialIcons
            name="call-made"
            size={20}
            color={`${filterByToPay ? 'red' : 'white'}`}
          />
        </View>
        <View>
          <Text
            variant={'bodyMedium'}
            className={`${filterByToPay ? 'text-slate-100' : 'text-slate-500'}`}
          >
            To Pay
          </Text>
          <Text
            variant={'titleMedium'}
            className={`${
              filterByToPay ? 'text-white' : 'text-slate-700'
            } font-bold `}
          >
            {homePage
              ? Math.abs(parseFloat(cardAmount?.toPay).toFixed(2))
              : propToPay
              ? Math.abs(parseFloat(propToPay).toFixed(2))
              : 0}{' '}
            ₹
          </Text>
        </View>
      </Box>
    </StyledView>
  );
}
