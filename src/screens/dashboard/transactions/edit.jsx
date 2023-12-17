// noinspection JSValidateTypes
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Dialog, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useEditPaymentApi, useProductsApi, useUpdatePaymentApi } from '../../../apis/use-api';
import { convertDateFormat, getItem, setItem, showToast } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import { useAuthCompanyStore } from '../../../hooks/zustand-store';
import { DropDownFlashList } from '../../components';

const TRANS_TYPES = [
  { id: 1, name: 'Given' },
  { id: 2, name: 'Received' },
];
const EditTransaction = ({ navigation, route }) => {
  const auth = useAuth.use?.token();
  const {
    mutate: request,
    data: paymentApiResponse,
    isSuccess: isPaymentSuccess,
    error: paymentError,
    isLoading: updateLoading,
    isError,
  } = useUpdatePaymentApi();

  const { mutate: productRequest, isLoading, data: products } = useProductsApi();

  const {
    mutate: editApiRequest,
    data: transactionData,
    isLoading: loadingTransactionData,
  } = useEditPaymentApi();

  const [amount, setAmount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [inputDate, setInputDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(1);
  const [qty, setQty] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [inventoryChecked, setInventoryChecked] = React.useState(false);
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  const transaction = route?.params?.transaction;

  useEffect(() => {
    setSelectedProduct(transaction?.product);
    setSelectedCustomer(transaction?.customer);
    // let imageURI = `http://mycreditbook.com/images/${transaction?.image}`;
    // setImageUri(imageURI)
    const transactionType = TRANS_TYPES.filter((x) => x.id === transaction.transaction_type_id);
    setTransactionType(transactionType[0]);
    setInputDate(new Date(transaction.date));
    loadTransactionData();
  }, [route.params?.transaction]);

  useEffect(() => {
    if (!loadingTransactionData) {
      if (transactionData !== null || transactionData?.data !== undefined) {
        setInventoryChecked(transactionData?.data?.qty > 0 && transactionData?.data?.price > 0);
        setPrice(transactionData?.data?.price || 0);
        setQty(transactionData?.data?.qty || 0);
        setAmount(parseFloat(transactionData?.data?.amount).toFixed(4) || 0);
        setNote(transactionData?.data?.notes || '');
      }
    }
  }, [loadingTransactionData]);

  function loadTransactionData() {
    const formData = new FormData();
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('company_id', company?.id);
    formData.append('user_id', auth.user.id);
    formData.append('id', route?.params?.transaction?.id);
    editApiRequest(formData);
  }

  useEffect(() => {
    const formData = new FormData();
    formData.append('company_id', company?.id);
    productRequest(formData);
  }, []);

  useEffect(() => {
    if (isError) {
      showToast(paymentError.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      const { status: contactStatus } = await Contacts.requestPermissionsAsync();
      if (contactStatus === 'granted') {
        try {
          const localContacts = await getItem('contacts');
          if (localContacts) {
            setContacts(localContacts);
          } else {
            const { data: contactsArray } = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
            });
            if (contactsArray.length > 0) {
              setContacts(contactsArray);
              setItem('contacts', contactsArray).then((r) => null);
            }
          }
        } catch (error) {
          const { data: contactsArray } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
          });
          if (contactsArray.length > 0) {
            setContacts(contactsArray);
            setItem('contacts', contactsArray).then((r) => null);
          }
        }
      }
    })();
  }, []);

  useEffect(
    function () {
      setAmount((parseFloat(price || 0) * parseFloat(qty || 1)).toFixed(4));
    },
    [price, qty],
  );

  useEffect(() => {
    if (isPaymentSuccess) {
      showToast(paymentApiResponse.data.message, 'success');
      setTimeout(() => navigation.navigate('HomePage'), 1000);
    }
  }, [isPaymentSuccess]);

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
    if (selectedCustomer === null) {
      showToast('Please Select Customer', 'error');
      return false;
    }
    if (inventoryChecked) {
      if (price === 0 || qty === 0) {
        showToast('Please check price and qty', 'error');
        return false;
      }
    }

    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user?.cost_center_id);
    // formData.append("customer_name", selectedCustomer?.name);
    formData.append('from_date', convertDateFormat(inputDate.toString()));
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Modify the type based on your image type
        name: 'image.jpg', // Modify the name based on your image name
      });
    }
    formData.append('notes', note);
    // formData.append("phone", selectedCustomer?.phoneNumbers ? selectedCustomer?.phoneNumbers[0]?.digits : selectedCustomer?.phone || null);
    // formData.append("phone_id", selectedCustomer?.id);
    if (inventoryChecked) {
      if (selectedProduct) {
        formData.append('product_id', selectedProduct?.id);
      }
      formData.append('price', price);
      formData.append('qty', qty);
    }
    formData.append('amount', amount);
    formData.append('transaction_type_id', transactionType?.id);
    formData.append('user_id', auth?.user?.id);
    formData.append('id', transaction?.id);
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

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setPrice(product.price);
  };

  const handleDateChange = (d) => setInputDate(d);
  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white px-4 pt-2">
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
          headerTitle="Showing contact from Phonebook"
          onSelect={handleContactSelect}
          selectedItemName={transaction?.customer?.name}
          enableSearch
          isReadOnly
        />
        {inventoryChecked && (
          <>
            {!isLoading && (
              <View className="-z-10 mt-2">
                <DropDownFlashList
                  data={products}
                  inputLabel="Select Product"
                  headerTitle="List of products"
                  onSelect={handleProductSelect}
                  selectedItemName={transaction?.product?.name}
                  enableSearch
                />
              </View>
            )}
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
          mode="outlined"
          label="Amount"
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          editable={!inventoryChecked}
        />
        <View className="-z-30 mt-2 flex w-full flex-row">
          <DatePickerInput
            locale="en-GB"
            label="From"
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
        <View className="-z-10 mt-2" />
        <DropDownFlashList
          data={TRANS_TYPES}
          inputLabel="Transaction Type"
          headerTitle="Transaction Type"
          onSelect={(contactObj) => {
            setTransactionType(contactObj);
          }}
          isTransparent={false}
          filterEnabled
          enableSearch={false}
          selectedItemName={transactionType?.name || ''}
        />
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
          mode="contained"
          className="-z-50 mt-4 bg-green-600 py-1"
          loading={updateLoading}
          disabled={updateLoading}
          onPress={() => onFormSubmit()}>
          Update
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

export default React.memo(EditTransaction);
