// noinspection JSValidateTypes
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Dialog, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { usePaymentApi, useProductsApi } from '../../apis/use-api';
import { convertDateFormat, processString, showToast } from '../../core/utils';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore, useContactsStore } from '../../hooks/zustand-store';
import { DropDownFlashList } from '../components';

const GiveMoney = ({ navigation, route }) => {
  const { user: auth } = useAuthStore();
  const {
    mutate: request,
    data: paymentApiResponse,
    isSuccess: isPaymentSuccess,
    error: paymentError,
    isError,
  } = usePaymentApi();

  const { mutate: productRequest, data: products } = useProductsApi();

  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const [amount, setAmount] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [inputDate, setInputDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(1);
  const [qty, setQty] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(route.params?.customer || null);
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
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      if (selectedCustomer?.phoneNumbers) {
        setContactSelectedMobileNumber(processString(selectedCustomer?.phoneNumbers[0]?.numbers));
        const updatedData = (selectedCustomer?.phoneNumbers).map((obj) => {
          return {
            ...obj,
            name: obj.digits ? processString(obj.digits) : processString(obj.number),
          };
        });
        setContactMobileNumbers(updatedData);
      }
    }
  }, [selectedCustomer]);

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
    if (isError) {
      showToast(paymentError.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    setAmount((parseFloat(price || 0) * parseFloat(qty || 1)).toFixed(4));
  }, [price, qty]);

  if (isPaymentSuccess) {
    showToast(paymentApiResponse.data.message, 'success');
    setTimeout(() => navigation.navigate('HomePage'), 1000);
  }

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

    if (selectedCustomer === null) {
      showToast('Please Select Customer', 'error');
      return false;
    }

    // if (!selectedCustomer?.phoneNumbers && phoneNumber === null) {
    //   showToast(
    //     "The contact you selected doesn't have a mobile number!",
    //     'error',
    //   );
    //   return false;
    // }
    //
    // if (contactSelectedMobileNumber === undefined) {
    //   showToast('Please enter customer mobile number!', 'error');
    //   return false;
    // }
    //
    if (phoneNumber === null) {
      phoneNumber = contactSelectedMobileNumber;
    }

    if (price === 0 || qty === 0) {
      showToast('Please check price and qty', 'error');
      return false;
    }

    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user?.cost_center_id);
    formData.append('customer_name', selectedCustomer?.name);
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
    formData.append('phone_id', selectedCustomer?.id);
    if (selectedProduct) {
      formData.append('product_id', selectedProduct?.id);
    }
    if (inventoryChecked) {
      formData.append('price', price);
      formData.append('qty', qty);
    }
    formData.append('amount', amount);
    formData.append('transaction_type_id', 1);
    formData.append('user_id', auth?.user?.id);
    request(formData);
  };

  const handlePriceChange = (inputPrice) => {
    setPrice(inputPrice);
  };

  const handleQtyChange = (inputQty) => {
    setQty(inputQty);
  };

  const handleContactSelect = (contactObj) => {
    setSelectedCustomer(contactObj);
  };

  const handleDateChange = (d) => setInputDate(d);

  const [inventoryChecked, setInventoryChecked] = React.useState(false);

  useEffect(() => {
    setAmount('');
  }, [inventoryChecked]);

  return (
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
        <DropDownFlashList
          data={contacts}
          inputLabel="Select Customer"
          headerTitle="Showing contact from Phone book"
          onSelect={handleContactSelect}
          selectedItemName={selectedCustomer?.name}
          filterEnabled
        />
        {selectedCustomer && (
          <>
            {contactMobileNumbers.length === 1 ||
            contactSelectedMobileNumber === null ||
            route?.params?.customer?.phone === null ||
            contactSelectedMobileNumber === undefined ? (
              <TextInput
                className="-z-30 mt-2 bg-white"
                onChangeText={(mobile) => setContactSelectedMobileNumber(mobile)}
                value={contactSelectedMobileNumber === 'null' ? '' : contactSelectedMobileNumber}
                mode="outlined"
                label="Mobile Number"
                keyboardType="phone-pad"
              />
            ) : (
              <>
                {route?.params?.customer?.phone ||
                  (contactMobileNumbers && (
                    <View className="-z-10 mt-2">
                      <DropDownFlashList
                        data={contactMobileNumbers}
                        inputLabel={
                          contactSelectedMobileNumber
                            ? 'Selected Mobile Number'
                            : 'Select Mobile Number'
                        }
                        selectedItemName={processString(selectedCustomer?.phoneNumbers[0]?.number)}
                        selectedItemDigits={processString(
                          selectedCustomer?.phoneNumbers[0]?.digits
                        )}
                        enableSearch={false}
                        headerTitle={`List of mobile numbers for ${selectedCustomer?.name}`}
                        onSelect={(contact) => {
                          setContactSelectedMobileNumber(
                            contact?.digits
                              ? processString(contact?.digits)
                              : contact?.number
                                ? processString(contact?.number)
                                : null
                          );
                        }}
                      />
                    </View>
                  ))}
              </>
            )}
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
        <Button mode="contained" className="-z-50 mt-4 py-1" onPress={() => onFormSubmit()}>
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
    </View>
  );
};

export default React.memo(GiveMoney);
