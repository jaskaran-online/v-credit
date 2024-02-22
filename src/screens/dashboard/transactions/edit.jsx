// noinspection JSValidateTypes
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Checkbox, Dialog, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useEditPaymentApi, useProductsApi, useUpdatePaymentApi } from '../../../apis/use-api';
import { COLORS } from '../../../core';
import { convertDateFormat, showToast } from '../../../core/utils';
import { useAuthStore } from '../../../hooks/auth-store';
import { useAuthCompanyStore } from '../../../hooks/zustand-store';
import { DropDownFlashList } from '../../components';

const TRANS_TYPES = [
  { id: 1, name: 'Given' },
  { id: 2, name: 'Received' },
];
const EditTransaction = ({ navigation, route }) => {
  const transaction = route?.params?.transaction;

  const { user: auth } = useAuthStore();
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

  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [imageUri, setImageUri] = useState(null);
  const [inputDate, setInputDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(1);
  const [qty, setQty] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [inventoryChecked, setInventoryChecked] = React.useState(false);
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const queryClient = useQueryClient();

  useEffect(
    function () {
      if (transactionData) {
        setInventoryChecked(transactionData?.data?.qty > 0 && transactionData?.data?.price > 0);
        setPrice(transactionData?.data?.price || 1);
        setQty(transactionData?.data?.qty || 1);
        setNote(transactionData?.data?.notes || '');
        setTransactionType(transactionData?.data?.transaction_type);
      }
    },
    [transactionData]
  );

  useEffect(function () {
    function loadTransactionData() {
      const formData = new FormData();
      formData.append('id', route?.params?.transaction?.id);
      editApiRequest(formData);
    }
    loadTransactionData();
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append('company_id', company?.id);
    productRequest(formData);
  }, [company?.id, productRequest]);

  useEffect(() => {
    if (isError) {
      showToast(paymentError.message, 'error');
    }
  }, [isError, paymentError]);

  useEffect(() => {
    if (isPaymentSuccess) {
      queryClient.invalidateQueries(['userCustomerList', auth.user.id]);
      queryClient.invalidateQueries(['userTodayTransactionsTotal', auth.user.id]);
      queryClient.invalidateQueries(['userTodayTransactions', auth.user.id]);

      showToast(paymentApiResponse.data.message, 'success');
      setTimeout(() => navigation.navigate('HomePage'), 1000);
    }
  }, [isPaymentSuccess, auth, queryClient, navigation, paymentApiResponse]);

  const showDialog = useCallback(() => {
    setVisible(true);
    Keyboard.dismiss();
  }, []);

  const hideDialog = useCallback(() => setVisible(false), []);

  const handleCameraCapture = useCallback(async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    if (cameraStatus === 'granted') {
      const photo = await ImagePicker.launchCameraAsync();
      if (!photo?.cancelled) {
        setImageUri(photo?.uri);
        hideDialog();
      }
    }
  }, [hideDialog]);

  const pickImage = useCallback(async () => {
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
  }, [hideDialog]);

  const onFormSubmit = useCallback(() => {
    if (inventoryChecked) {
      if (price === 0 || qty === 0) {
        showToast('Please check price and qty', 'error');
        return false;
      }
    }

    const formData = new FormData();
    if (company?.id) {
      formData.append('company_id', company?.id);
    }

    if (auth.user?.cost_center_id) {
      formData.append('cost_center_id', auth.user?.cost_center_id);
    }

    formData.append('from_date', convertDateFormat(inputDate.toString()));
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Modify the type based on your image type
        name: 'image.jpg', // Modify the name based on your image name
      });
    }
    formData.append('notes', note);
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
  }, [
    amount,
    auth,
    company,
    imageUri,
    inputDate,
    inventoryChecked,
    note,
    price,
    qty,
    request,
    selectedProduct,
    transaction,
    transactionType,
  ]);

  const handlePriceChange = useCallback((inputPrice) => {
    setPrice(inputPrice);
    setAmount(inputPrice * qty);
  }, []);

  const handleQtyChange = useCallback((inputQty) => {
    setQty(inputQty);
    setAmount(inputQty * price);
  }, []);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
    if (product.price) {
      setPrice(product.price);
    }
  }, []);

  const handleDateChange = useCallback((d) => setInputDate(d), []);

  if (loadingTransactionData) {
    return (
      <View className="flex-1 justify-center  items-center bg-white">
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

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
        <TextInput
          value={transaction?.customer?.name}
          onChangeText={() => null}
          mode="outlined"
          label="Selected Customer"
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
          loading={loadingTransactionData}
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
          multiline
          numberOfLines={4}
          loading={loadingTransactionData}
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
