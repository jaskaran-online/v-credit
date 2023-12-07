import React, { useRef, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Button, Text } from 'react-native-paper';
import { useItemsData } from '../../apis/useApi';

function ListHeaderComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white py-2 mb-2">
      <Text variant="titleMedium">Select an item</Text>
    </View>
  );
}

export default function Purchase() {
  const sheetRef = useRef(null);
  const sheetStatusRef = useRef('close');
  // variables
  const snapPoints = useMemo(() => ['1%', '50%', '60%'], []);
  const { data: itemsData, isFetching, isLoading, isError } = useItemsData();
  console.log(itemsData, isFetching, isLoading, isError);
  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log('handleSheetChange', index);
  }, []);

  const handleSnapPress = useCallback((index) => {
    if (sheetStatusRef.current === 'open') {
      sheetRef.current?.close();
      sheetStatusRef.current = 'close';
    } else {
      sheetRef.current?.snapToIndex(index);
      sheetStatusRef.current = 'open';
    }
  }, []);

  console.log(sheetStatusRef.current);

  return (
    <View className={'flex-1'}>
      <Text>Purchase</Text>
      <Button
        onPress={() => {
          handleSnapPress(2);
        }}
      >
        Snap To 90%
      </Button>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetFlatList
          data={itemsData?.data}
          keyExtractor={(i) => i}
          ListHeaderComponent={<ListHeaderComponent />}
          renderItem={({ item }) => (
            <View
              className={
                'flex-row justify-between px-4 space-x-2 items-center py-3 border-b border-slate-200'
              }
            >
              <Text className={' text-slate-800'}>{item.name}</Text>
            </View>
          )}
          // contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    </View>
  );
}
