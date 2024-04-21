// noinspection JSValidateTypes
import { AntDesign, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Dialog, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { usePaymentApi, useProductsApi } from '../../apis/use-api';
import ContactList from '../../components/contact-list-model';
import Loading from '../../components/loading';
import { convertDateFormat, processString, showToast } from '../../core/utils';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore, useContactsStore } from '../../hooks/zustand-store';
import { BottomSheetBackground, renderBackdropComponent } from '../auth/register/register';
import { DropDownFlashList } from '../components';

const TakePayment = ({ navigation, route }) => {
  const { user: auth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const {
    mutate: request,
    data: paymentApiResponse,
    isSuccess: isPaymentSuccess,
    error: paymentError,
    isError,
  } = usePaymentApi();
  const { mutate: productRequest, data: products } = useProductsApi();

  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const [selectedContact, setSelectedContact] = useState(route.params?.customer || null);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [inputDate, setInputDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(1);
  const [qty, setQty] = useState(1);
  const contacts = useContactsStore((state) => state.contactsList);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [contactMobileNumbers, setContactMobileNumbers] = useState(
    route?.params?.customer?.phone
      ? [
          {
            name: route?.params?.customer?.name,
            digits: route?.params?.customer?.phone,
          },
        ]
      : []
  );
  const [contactSelectedMobileNumber, setContactSelectedMobileNumber] = useState(
    route?.params?.customer?.phone || undefined
  );

  useEffect(() => {
    const formData = new FormData();
    formData.append('company_id', company?.id);
    productRequest(formData);
  }, [company?.id, productRequest]);

  useEffect(() => {
    if (selectedContact) {
      if (selectedContact?.phoneNumbers) {
        setContactSelectedMobileNumber(processString(selectedContact?.phoneNumbers[0]?.numbers));
        const updatedData = (selectedContact?.phoneNumbers).map((obj) => {
          return {
            ...obj,
            name: obj.digits ? processString(obj.digits) : processString(obj.number),
          };
        });
        setContactMobileNumbers(updatedData);
      }
    }
  }, [selectedContact]);

  useEffect(() => {
    if (contactMobileNumbers.length === 1) {
      if (contactMobileNumbers[0]?.digits) {
        setContactSelectedMobileNumber(processString(contactMobileNumbers[0]?.digits));
      } else {
        setContactSelectedMobileNumber(processString(contactMobileNumbers[0]?.number));
      }
    }
  }, [contactMobileNumbers]);

  useEffect(() => {
    if (isError && paymentError?.message) {
      showToast(paymentError.message, 'danger');
      setIsLoading(false);
    }
  }, [isError, paymentError]);

  useEffect(() => {
    setAmount((parseFloat(price || 0) * parseFloat(qty || 1)).toFixed(4));
  }, [price, qty]);

  useEffect(() => {
    if (isPaymentSuccess) {
      showToast(paymentApiResponse.message, 'success');
      setIsLoading(false);
      setTimeout(() => navigation.navigate('HomePage'), 1000);
    }
    return () => {
      setIsLoading(false);
    };
  }, [isPaymentSuccess, paymentApiResponse?.message]);

  const showDialog = () => {
    setVisible(true);
    Keyboard.dismiss();
  };

  const hideDialog = () => setVisible(false);

  const handleCameraCapture = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    if (cameraStatus === 'granted') {
      const photo = await ImagePicker.launchCameraAsync();
      if (!photo?.cancelled) {
        setImageUri(photo?.uri);
        hideDialog();
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
      hideDialog();
    }
  };
  const onFormSubmit = () => {
    let phoneNumber = route?.params?.customer?.phone || null;

    if (selectedContact === null) {
      showToast('Please Select Customer', 'danger');
      return false;
    }

    if (phoneNumber === null) {
      phoneNumber = contactSelectedMobileNumber;
    }

    if (price === 0 || qty === 0) {
      showToast('Please check price and qty', 'danger');
      return false;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user?.cost_center_id);
    formData.append('customer_name', selectedContact?.name);
    formData.append('from_date', convertDateFormat(inputDate.toString()));
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Modify the type based on your image type
        name: 'image.jpg', // Modify the name based on your image name
      });
    }
    formData.append('notes', note);
    formData.append('phone', phoneNumber);
    formData.append('phone_id', selectedContact?.id);
    if (selectedProduct) {
      formData.append('product_id', selectedProduct?.id);
    }
    if (inventoryChecked) {
      formData.append('price', price);
      formData.append('qty', qty);
    }
    formData.append('amount', amount);
    formData.append('transaction_type_id', 2);
    formData.append('user_id', auth?.user?.id);

    if (auth?.user?.mobile) {
      formData.append('from_mobile', auth.user.mobile);
    }

    formData.append('to_name', selectedContact?.name);

    formData.append('to_mobile', phoneNumber);

    request(formData);
  };

  const handleQtyChange = (inputQty) => {
    setQty((prevQty) => inputQty);
  };

  const handlePriceChange = (inputPrice) => {
    setPrice((prevPrice) => inputPrice);
  };

  const handleDateChange = (d) => setInputDate(d);

  const [inventoryChecked, setInventoryChecked] = React.useState(false);

  useEffect(() => {
    setAmount('');
  }, [inventoryChecked]);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['88%', '95%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    Keyboard.dismiss();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 bg-white">
          <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white px-4 pt-1">
            <View className="my-1 mr-5 flex flex-row items-center justify-end">
              <Checkbox
                status={inventoryChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setInventoryChecked(!inventoryChecked);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setInventoryChecked(!inventoryChecked);
                }}>
                <Text>Inventory</Text>
              </TouchableOpacity>
            </View>
            <View className="mb-1" />
            {selectedContact && <Text className="text-slate-600 mb-1 mt-2">Name</Text>}
            <TouchableOpacity
              onPress={() => {
                handlePresentModalPress();
                setSelectedContact(null);
              }}
              className="h-[50px] border border-slate-500 bg-white rounded-[4px] flex flex-row items-center px-4 justify-between">
              {selectedContact ? (
                <Text className="text-gray-900 text-[16px]">{selectedContact?.name}</Text>
              ) : (
                <Text className="text-slate-600 text-[16px]">Select Customer</Text>
              )}
              {selectedContact ? (
                <AntDesign name="close" size={16} color="gray" />
              ) : (
                <AntDesign name="down" size={18} color="gray" />
              )}
            </TouchableOpacity>
            <View className="mb-1" />
            {selectedContact && (
              <>
                <TextInput
                  mode="outlined"
                  label="Mobile Number"
                  keyboardType="number-pad"
                  className="h-[50px] bg-white"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChangeText={(text) => setMobileNumber(text)}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          onPress={
                            (selectedContact && selectedContact?.phoneNumbers)?.length > 1
                              ? handlePresentModalPress
                              : () => null
                          }
                          name="chevron-down"
                          size={20}
                          color="gray"
                        />
                      )}
                    />
                  }
                />
              </>
            )}
            <View className="-z-10 mt-2">
              <DropDownFlashList
                data={products || []}
                inputLabel="Select Product"
                headerTitle="List of products"
                onSelect={function (product) {
                  setSelectedProduct(product);
                  handlePriceChange(parseFloat(product?.price || 0).toFixed(4));
                }}
              />
            </View>
            {inventoryChecked && (
              <>
                <View className="-z-30 mt-0 flex flex-row gap-2">
                  <TextInput
                    className="-z-30 mt-2 flex-1 bg-white"
                    onChangeText={handleQtyChange}
                    value={qty.toString()}
                    mode="outlined"
                    label="Qty"
                    keyboardType="decimal-pad"
                  />
                  <TextInput
                    className="-z-30 mt-2 flex-1 bg-white"
                    onChangeText={handlePriceChange}
                    value={price.toString()}
                    mode="outlined"
                    label="Price"
                    keyboardType="decimal-pad"
                  />
                </View>
              </>
            )}
            <TextInput
              className="-z-30 mt-2 bg-white"
              value={amount.toString()}
              onChangeText={setAmount}
              mode="outlined"
              label="Amount"
              keyboardType="decimal-pad"
              editable={!inventoryChecked}
            />
            <View className="-z-30 mt-2 flex w-full flex-row">
              <DatePickerInput
                locale="en-GB"
                label="Date"
                value={inputDate}
                onChange={handleDateChange}
                inputMode="start"
                mode="outlined"
                className="mx-1 bg-blue-50"
              />
              <TouchableOpacity
                onPress={showDialog}
                className="mx-3 my-[4px] flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 px-4 shadow-sm">
                <MaterialCommunityIcons name="camera" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="-z-30 mt-2 bg-white"
              onChangeText={(text) => setNote(text)}
              value={note}
              mode="outlined"
              label="Notes (Optional)"
              inputMode="text"
            />
            <>
              {imageUri && (
                <Image
                  source={{ uri: imageUri, width: 150, height: 150 }}
                  resizeMethod="auto"
                  className="mt-4"
                />
              )}
            </>
            <Button
              disabled={isLoading}
              mode="contained"
              className="-z-50 mt-4 py-1"
              onPress={() => onFormSubmit()}>
              Submit
            </Button>
          </KeyboardAvoidingView>

          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            dismissable
            style={{ backgroundColor: 'white' }}
            dismissableBackButton>
            <Dialog.Title style={{ fontSize: 18 }}>Select</Dialog.Title>
            <Dialog.Content>
              <View className="mb-10 mt-5 flex flex-row justify-evenly">
                <View className="flex items-center gap-2">
                  <TouchableOpacity
                    onPress={handleCameraCapture}
                    className="flex items-center justify-center rounded-3xl bg-blue-500 p-4 shadow-md">
                    <MaterialCommunityIcons name="camera" size={30} color="white" />
                  </TouchableOpacity>
                  <Text variant="titleMedium" className="text-stone-600">
                    Camera
                  </Text>
                </View>
                <View className="flex items-center gap-2">
                  <TouchableOpacity
                    onPress={pickImage}
                    className="flex items-center justify-center rounded-3xl bg-green-600 p-4 shadow-md">
                    <MaterialIcons name="photo" size={30} color="white" />
                  </TouchableOpacity>
                  <Text variant="titleMedium" className="text-stone-600">
                    Gallery
                  </Text>
                </View>
              </View>
            </Dialog.Content>
          </Dialog>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdropComponent}
            backgroundComponent={(props) => <BottomSheetBackground {...props} />}
            handleIndicatorStyle={{
              backgroundColor: 'lightgray',
            }}>
            {selectedContact?.phoneNumbers?.length > 1 ? (
              <View className="flex-1 mt-2">
                <Text className="mb-2 text-xl font-bold text-gray-800 ml-4">Select Number</Text>
                <BottomSheetFlatList
                  onscroll={() => Keyboard.dismiss()}
                  estimatedItemSize={1000}
                  keyExtractor={(value, index) => `${index}`}
                  renderItem={({ item, index: i }) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        width: '100%',
                        height: 80,
                      }}
                      onPress={() => {
                        setSelectedMobileNumber(item);
                        if (item?.number) {
                          if (item?.number.includes('-') || item?.number.includes(' ')) {
                            setMobileNumber(item?.number?.replaceAll('-', '').replaceAll(' ', ''));
                          } else {
                            setMobileNumber(item?.number);
                          }
                        }
                        bottomSheetModalRef.current?.dismiss();
                      }}
                      className="p-4 bg-slate-50 mt-2 mx-4 rounded-md flex flex-row items-center w-full h-16">
                      <FontAwesome6 name="mobile-retro" size={24} color="gray" />
                      <View className="ml-4 flex flex-row">
                        <Text variant="titleSmall" className="text-slate-900">
                          {item?.number}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  data={selectedContact?.phoneNumbers}
                />
              </View>
            ) : (
              <ContactList
                contacts={contacts}
                onSelect={(selectedContactItem) => {
                  bottomSheetModalRef.current?.dismiss();
                  setSelectedContact(selectedContactItem);
                  if (selectedContactItem) {
                    if (
                      selectedContactItem?.phoneNumbers[0]?.number?.includes('-') ||
                      selectedContactItem?.phoneNumbers[0]?.number?.includes(' ')
                    ) {
                      setMobileNumber(
                        selectedContactItem?.phoneNumbers[0]?.number
                          ?.replaceAll('-', '')
                          ?.replaceAll(' ', '')
                      );
                    } else {
                      setMobileNumber(selectedContactItem?.phoneNumbers[0]?.number);
                    }
                  }
                }}
                onscroll={() => Keyboard.dismiss()}
              />
            )}
          </BottomSheetModal>
        </View>
      )}
    </>
  );
};

export default React.memo(TakePayment);
