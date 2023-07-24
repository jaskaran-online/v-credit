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
import { Button, Dialog, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';
import {
  useCustomersData,
  usePaymentApi,
  useProductsApi,
} from '../../../apis/useApi';
import { getItem, setItem } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import DropDownFlashList from '../../Components/dropDownFlashList';

const showToast = (message, type) => {
  Toast.show({
    type: type,
    text1: type === 'success' ? 'Success' : 'Error',
    text2: message,
    position: 'bottom',
  });
};

function convertDateFormat(dateString) {
  const dateObj = new Date(dateString);

  const convertedDate = dateObj
      .toISOString()
      .slice(0, 10) // Extract YYYY-MM-DD
      .replace('T', ' '); // Replace 'T' with a space

  const convertedTime = dateObj.toISOString().slice(11, 19); // Extract HH:MM:SS

  return `${convertedDate} ${convertedTime}`;
}

const TakePayment = ({ navigation, route }) => {
  const auth = useAuth.use?.token();
  const {
    mutate: request,
    data: paymentApiResponse,
    isSuccess: isPaymentSuccess,
    error: paymentError,
    isError,
  } = usePaymentApi();
  const { mutate: productRequest, data: products } = useProductsApi();
  const {
    mutate: customerRequest,
    data: customerData,
    isLoading: isLoadingCustomer,
  } = useCustomersData();

  const [amount, setAmount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [inputDate, setInputDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [price, setPrice] = useState(1);
  const [qty, setQty] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(
    route.params?.customer || null,
  );
  const [selectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [contactMobileNumbers, setContactMobileNumbers] = useState(
    route?.params?.customer?.phone
      ? [
          {
            name: route?.params?.customer?.name,
            digits: route?.params?.customer?.phone,
          },
        ]
      : [],
  );
  const [contactSelectedMobileNumber, setContactSelectedMobileNumber] =
    useState(route?.params?.customer?.phone || null);

  useEffect(() => {
    loadCustomerData();
    const formData = new FormData();
    formData.append('company_id', auth?.user?.company_id);
    productRequest(formData);
  }, []);

  useEffect(() => {
    if (selectedCustomer?.phoneNumbers) {
      const updatedData = (selectedCustomer?.phoneNumbers).map((obj) => {
        return {
          ...obj,
          name: obj.digits
            ? processString(obj.digits)
            : processString(obj.number),
        };
      });
      setContactMobileNumbers(updatedData);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (contactMobileNumbers.length === 1) {
      if (contactMobileNumbers[0]?.digits) {
        setContactSelectedMobileNumber(
          processString(contactMobileNumbers[0]?.digits),
        );
      } else {
        setContactSelectedMobileNumber(
          processString(contactMobileNumbers[0]?.number),
        );
      }
    }
  }, [contactMobileNumbers]);

  useEffect(() => {
    if (isError) {
      showToast(paymentError.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoadingCustomer) {
      loadContactsFromDevice();
    }
  }, [isLoadingCustomer]);

  useEffect(() => {
    setAmount((parseFloat(price || 0) * parseFloat(qty || 1)).toFixed(4));
  }, [price, qty]);

  if (isPaymentSuccess) {
    showToast(paymentApiResponse.data.message, 'success');
    setTimeout(() => navigation.navigate('HomePage'), 1000);
  }

  const loadContactsFromDevice = async () => {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync();
    if (contactStatus === 'granted') {
      let filteredContacts = customerData?.data
        ?.map((obj) => obj.customer)
        ?.map((obj) => {
          return {
            id: obj.phone_id,
            name: obj.name,
            digits: obj.phone,
            contactType: 'person',
            phoneNumbers: [{ digits: obj.phone }],
            imageAvailable: false,
          };
        });

      try {
        const localContacts = await getItem('contacts');
        if (localContacts) {
          setContacts([...filteredContacts, ...localContacts]);
        } else {
          const { data: contactsArray } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
          });
          if (contactsArray.length > 0) {
            setContacts([...filteredContacts, ...contactsArray]);
            setItem('contacts', contactsArray).then((r) => null);
          }
        }
      } catch (error) {
        const { data: contactsArray } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (contactsArray.length > 0) {
          setContacts([...filteredContacts, ...contactsArray]);
          setItem('contacts', contactsArray).then((r) => null);
        }
      }
    }
  };

  function loadCustomerData() {
    const customerFormData = new FormData();
    customerFormData.append('cost_center_id', auth?.user.cost_center_id);
    customerFormData.append('company_id', auth?.user.company_id);
    customerFormData.append('user_id', auth?.user.id);
    customerRequest(customerFormData);
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
    let phoneNumber = route?.params?.customer?.phone || null;

    if (selectedCustomer === null) {
      showToast('Please Select Customer', 'error');
      return false;
    }

    if (!selectedCustomer?.phoneNumbers && phoneNumber === null) {
      showToast(
        "The contact you selected doesn't have a mobile number!",
        'error',
      );
      return false;
    }

    if (phoneNumber == null) {
      phoneNumber = contactSelectedMobileNumber;
    }

    if (price == 0 || qty == 0) {
      showToast('Please check price and qty', 'error');
      return false;
    }

    const formData = new FormData();
    formData.append('company_id', auth.user?.company_id);
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
    formData.append('price', price);
    formData.append('qty', qty);
    formData.append('transaction_type_id', 2);
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

  function processString(input = null) {
    if (input == null || input === '' || input === 'null') {
      return '';
    }
    // Remove "-", ",", and spaces from the string
    let processedString = input.replace(/[-,\s]/g, '');

    // If the resulting string has a length greater than 10, remove the first three letters
    if (processedString.length > 10) {
      processedString = processedString.substring(3);
    }

    return processedString;
  }

  return (
    <View className={'flex-1 bg-white'}>
      <KeyboardAvoidingView
        behavior='padding'
        className={'bg-white flex-1 px-4 pt-2'}
      >
        <DropDownFlashList
          data={contacts}
          inputLabel='Select Customer'
          headerTitle='Showing contact from Phone book'
          onSelect={handleContactSelect}
          selectedItemName={selectedCustomer?.name}
          filterEnabled={true}
        />
        {selectedCustomer && (
          <>
            {contactMobileNumbers.length === 1 ||
            contactSelectedMobileNumber === null ||
            contactSelectedMobileNumber !== '' ? (
              <TextInput
                className={'bg-white mt-2 -z-30'}
                onChangeText={(mobile) =>
                  setContactSelectedMobileNumber(mobile)
                }
                value={
                  contactSelectedMobileNumber == 'null'
                    ? ''
                    : contactSelectedMobileNumber
                }
                mode={'outlined'}
                label={'Mobile Number'}
              />
            ) : (
              <>
                {contactMobileNumbers && (
                  <View className={'mt-2 -z-10'}>
                    <DropDownFlashList
                      data={contactMobileNumbers}
                      inputLabel={
                        contactSelectedMobileNumber
                          ? 'Selected Mobile Number'
                          : 'Select Mobile Number'
                      }
                      headerTitle={`List of mobile numbers for ${selectedCustomer?.name}`}
                      onSelect={(contact) => {
                        setContactSelectedMobileNumber(
                          contact?.digits
                            ? processString(contact?.digits)
                            : contact?.number
                            ? processString(contact?.number)
                            : null,
                        );
                      }}
                    />
                  </View>
                )}
              </>
            )}
          </>
        )}

        <View className={'mt-2 -z-10'}>
          <DropDownFlashList
            data={products || []}
            inputLabel='Select Product'
            headerTitle='List of products'
            onSelect={(product) =>
              handlePriceChange(parseFloat(product?.price || 0).toFixed(4))
            }
          />
        </View>
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
        <TextInput
          className={'bg-white mt-2 -z-30'}
          value={amount.toString()}
          mode={'outlined'}
          label={'Amount'}
          inputMode={'numeric'}
          editable={false}
        />
        <View className={'flex flex-row w-full mt-2 -z-30'}>
          <DatePickerInput
            locale='en-GB'
            label='Date'
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
          className={'mt-4 py-1 -z-50'}
          onPress={() => onFormSubmit()}
        >
          Submit
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

export default React.memo(TakePayment);
