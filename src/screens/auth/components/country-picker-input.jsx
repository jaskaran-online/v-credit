import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';

const fetchCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function CountryPickerInput() {
  const { data: countries, error, isLoading } = useQuery(['countries'], fetchCountries);

  // ref for bottom sheet modal
  const bottomSheetModalRef = useRef(null);

  // variables for bottom sheet modal
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error occurred: {error.message}</Text>;

  return (
    <BottomSheetModalProvider
      className="flex-1 z-50"
      style={{ backgroundColor: 'white', zIndex: 1000 }}>
      <View>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Text>Select Country</Text>
        </TouchableOpacity>

        <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={snapPoints}>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.name.common}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Image
                  source={{ uri: item.flags.png }}
                  style={{ width: 30, height: 20, marginRight: 10 }}
                />
                <Text>{item.name.common}</Text>
              </TouchableOpacity>
            )}
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

export default CountryPickerInput;
