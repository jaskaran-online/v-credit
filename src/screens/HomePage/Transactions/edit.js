// noinspection JSValidateTypes
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Checkbox, Dialog, Text, TextInput} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';
import {
  useEditPaymentApi,
  useProductsApi,
  useUpdatePaymentApi,
} from '../../../apis/useApi';
import { getItem, setItem } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import DropDownFlashList from '../../Components/dropDownFlashList';

function convertDateFormat(dateString) {
  const dateObj = new Date(dateString);

  const convertedDate = dateObj
    .toISOString()
    .slice(0, 10) // Extract YYYY-MM-DD
    .replace('T', ' '); // Replace 'T' with a space

  const convertedTime = dateObj.toISOString().slice(11, 19); // Extract HH:MM:SS

  return `${convertedDate} ${convertedTime}`;
}

const showToast = (message, type) => {
  Toast.show({
    type: type,
    text1: type === 'success' ? 'Success' : 'Error',
    text2: message,
    position: 'bottom',
  });
};

let TRANS_TYPES = [
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
  const {
    mutate: productRequest,
    isLoading,
    data: products,
  } = useProductsApi();

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

  const transaction = route?.params?.transaction;

  useEffect(() => {
    setSelectedProduct(transaction?.product);
    setSelectedCustomer(transaction?.customer);
    // let imageURI = `http://mycreditbook.com/images/${transaction?.image}`;
    // setImageUri(imageURI)
    let transactionType = TRANS_TYPES.filter(
      (x) => x.id === transaction.transaction_type_id,
    );
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
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('company_id', auth?.user.company_id);
    formData.append('user_id', auth.user.id);
    formData.append('id', route?.params?.transaction?.id);
    editApiRequest(formData);
  }

  useEffect(() => {
    const formData = new FormData();
    formData.append('company_id', auth?.user?.company_id);
    productRequest(formData);
  }, []);

  useEffect(() => {
    if (isError) {
      showToast(paymentError.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    (async () => {
      const { status: contactStatus } =
        await Contacts.requestPermissionsAsync();
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
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    if (cameraStatus === 'granted') {
      const photo = await ImagePicker.launchCameraAsync();
      if (!photo?.cancelled) {
        setImageUri(photo?.uri);
        hideDialog();
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
    if(inventoryChecked){
      if (price == 0 || qty == 0) {
        showToast('Please check price and qty', 'error');
        return false;
      }
    }

    const formData = new FormData();
    formData.append('company_id', auth.user?.company_id);
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
    if(inventoryChecked){
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
    <View className={'flex-1 bg-white'}>
      <KeyboardAvoidingView
        behavior='padding'
        className={'bg-white flex-1 px-4 pt-2'}
      >
        <View className={"mr-5 flex flex-row items-center justify-end my-1"}>
          <Checkbox
              status={inventoryChecked ? 'checked' : 'unchecked'}
              onPress={() => {
                setInventoryChecked(!inventoryChecked);
              }}
          />
          <TouchableOpacity onPress={() => {
            setInventoryChecked(!inventoryChecked);
          }}>
            <Text>Inventory</Text>
          </TouchableOpacity>
        </View>
        <DropDownFlashList
          data={contacts}
          inputLabel='Select Customer'
          headerTitle='Showing contact from Phonebook'
          onSelect={handleContactSelect}
          selectedItemName={transaction?.customer?.name}
          enableSearch={true}
          isReadOnly={true}
        />
        {inventoryChecked && (<>
            {!isLoading && (
              <View className={'mt-2 -z-10'}>
                <DropDownFlashList
                  data={products}
                  inputLabel='Select Product'
                  headerTitle='List of products'
                  onSelect={handleProductSelect}
                  selectedItemName={transaction?.product?.name}
                  enableSearch={true}
                />
              </View>
            )}
          <View className={'flex flex-row gap-2 mt-0 -z-30'}>
            <TextInput
                className={'bg-white flex-1 mt-2 -z-30'}
                onChangeText={handleQtyChange}
                value={qty.toString()}
                mode={'outlined'}
                label={'Qty'}
                keyboardType={'numeric'}
            />
            <TextInput
                className={'bg-white flex-1 mt-2 -z-30'}
                onChangeText={handlePriceChange}
                value={price.toString()}
                mode={'outlined'}
                label={'Price'}
                keyboardType={'numeric'}
            />
          </View>
        </>)}
        <TextInput
          className={'bg-white mt-2 -z-30'}
          value={amount.toString()}
          mode={'outlined'}
          label={'Amount'}
          onChangeText={setAmount}
          inputMode={'numeric'}
          editable={!inventoryChecked}
        />
        <View className={'flex flex-row w-full mt-2 -z-30'}>
          <DatePickerInput
            locale='en-GB'
            label='From'
            value={inputDate}
            onChange={handleDateChange}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />
          <TouchableOpacity
            onPress={showDialog}
            className={
              'flex items-center justify-center px-4 bg-blue-50 shadow-sm border border-blue-100 rounded-lg my-[4px] mx-3'
            }
          >
            <MaterialCommunityIcons name={'camera'} size={30} color={'black'} />
          </TouchableOpacity>
        </View>
        <View className={'mt-2 -z-10'} />
        <DropDownFlashList
            data={TRANS_TYPES}
            inputLabel='Transaction Type'
            headerTitle='Transaction Type'
            onSelect={(contactObj) => {
              setTransactionType(contactObj);
            }}
            isTransparent={false}
            filterEnabled={true}
            enableSearch={false}
            selectedItemName={transactionType?.name || ''}
        />
        <TextInput
          className={'bg-white mt-2 -z-30'}
          onChangeText={(text) => setNote(text)}
          value={note}
          mode={'outlined'}
          label={'Notes (Optional)'}
          inputMode={'text'}
        />
        <>
          {imageUri && (
            <Image
              source={{ uri: imageUri, width: 150, height: 150 }}
              resizeMethod={'auto'}
              className={'mt-4'}
            />
          )}
        </>
        <Button
          mode={'contained'}
          className={'mt-4 py-1 -z-50 bg-green-600'}
          loading={updateLoading}
          disabled={updateLoading}
          onPress={() => onFormSubmit()}
        >
          Update
        </Button>
      </KeyboardAvoidingView>

      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        dismissable={true}
        style={{ backgroundColor: 'white' }}
        dismissableBackButton={true}
      >
        <Dialog.Title style={{ fontSize: 18 }}>Select</Dialog.Title>
        <Dialog.Content>
          <View className={'flex flex-row justify-evenly mb-10 mt-5'}>
            <View className={'flex gap-2 items-center'}>
              <TouchableOpacity
                onPress={handleCameraCapture}
                className={
                  'flex justify-center items-center shadow-md bg-blue-500 p-4 rounded-3xl'
                }
              >
                <MaterialCommunityIcons
                  name={'camera'}
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text variant={'titleMedium'} className={'text-stone-600'}>
                Camera
              </Text>
            </View>
            <View className={'flex gap-2 items-center'}>
              <TouchableOpacity
                onPress={pickImage}
                className={
                  'flex justify-center items-center shadow-md bg-green-600 p-4 rounded-3xl'
                }
              >
                <MaterialIcons name={'photo'} size={30} color={'white'} />
              </TouchableOpacity>
              <Text variant={'titleMedium'} className={'text-stone-600'}>
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
