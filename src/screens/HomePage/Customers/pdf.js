import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import HTMLCodeView from './HTMLCodeView';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks';
import { useCustomerTransactionData } from '../../../apis/useApi';
import _ from 'lodash';
import { formatDateForMessage, useAuthCompanyStore } from '../../../core/utils';

const ShareScreen = ({ route }) => {
  const auth = useAuth.use?.token();
  const {
    mutate,
    data: customerData,
    isLoading,
  } = useCustomerTransactionData();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  let data = customerData?.data;
  function loadCustomerData() {
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('customer_id', route.params.id);
    formData.append('user_id', auth.user.id);
    mutate(formData);
  }

  useEffect(() => {
    loadCustomerData();
  }, []);

  const customer = data?.customer;
  let transactionsData = data?.transactions || [];
  const htmlCodeViewRef = useRef(null);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const toPay = parseFloat((data?.toPay || 0).toFixed(2));
  const toReceive = parseFloat((data?.toReceive || 0).toFixed(2));

  transactionsData = transactionsData.map((item) => {
    return {
      dateOnly: item.date.split(' ')[0],
      ...item,
    };
  });

  let transactionsGroupBy = _.groupBy(
    _.sortBy(transactionsData, ['dateOnly']),
    'dateOnly',
  );

  let balance = 0;
  let color = 'gray';
  if (toReceive > toPay) {
    balance = toReceive - toPay;
    color = 'darkgreen';
  } else if (toReceive < toPay) {
    balance = toPay - toReceive;
    color = 'tomato';
  }

  let tableRows = '';
  let index = 0;

  let ariseBalance = 0;
  for (const [date, transactions] of Object.entries(transactionsGroupBy)) {
    tableRows += `<tr style="background: #ffffff">
        <td colspan="5" style="padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">
            <span style="font-size: 10px;max-width: 30px;font-weight: bold;">${formatDateForMessage(
              date,
            )}</span>
        </td>
        </tr>`;
    for (let transaction of transactions) {
      let transactionAmount = transaction.amount;
      if (transaction.transaction_type_id === 1) {
        ariseBalance += transactionAmount;
      } else {
        ariseBalance -= transactionAmount;
      }
      tableRows += `
    <tr style="background: ${index % 2 === 0 ? 'white' : 'white'}">
        <td style="padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">
        <span style="max-width: 30px">${
          formatDateForMessage(transaction.date).split(' ')[0]
        } ${formatDateForMessage(transaction.date).split(' ')[1]}</span></td>
        <td style="padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">${
          transaction.transaction_type_id === 1
            ? 'Credit Given'
            : 'Payment Received'
        }</td>
        <td style=" ${
          transaction.transaction_type_id === 1
            ? 'background-color:rgba(255,167,154,0.28);'
            : null
        } padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">${
          transaction.transaction_type_id === 1 ? transactionAmount + ' ₹' : ''
        }</td>
        <td style=" ${
          transaction.transaction_type_id === 1
            ? null
            : 'background-color:#DDECD9FF;'
        }padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">${
          transaction.transaction_type_id === 1 ? ' ' : transactionAmount + ' ₹'
        }</td>
        <td style="padding: 10px 8px; text-align: left; border-bottom: 1px solid #ddd;">${
          Math.abs(ariseBalance) + ' ₹'
        }</td>
      </tr>
    `;
      ++index;
    }
  }
  const keys = Object.keys(transactionsGroupBy);
  const firstKey = keys[0];
  const lastKey = keys[keys.length - 1];

  const html = `
  <body style="position: relative;font-family: Arial, sans-serif; margin: 0;overflow: hidden; padding: 20px;">
      <br/>
    <header style="background-color: darkslateblue; padding: 20px;">
      <div style="text-align: center;display:flex; align-items: center;justify-content:space-between;">
        <h4 style="font-size: 24px; margin: 0;color:white;">My Credit Book</h4>
        <h6 style="font-size: 20px; margin: 0;color:white;"></h6>
      </div>
    </header>
    <div style="margin: 0 auto; padding: 20px;  border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20px;">
        <p style="font-size: 30px; margin: 0;font-weight: bold;">${
          customer?.name
        }</p>
        <p style="font-size: 17px; margin: 5px;color: dimgrey;">${
          auth?.user?.company?.name
        }</p>
        <p style="font-size: 17px; margin: 5px;color: dimgrey;">${
          customer?.phone
        }</p>
        <p style="font-size: 17px; margin: 5px;color: dimgrey;">(${formatDateForMessage(
          firstKey,
        )} - ${formatDateForMessage(lastKey)})</p>
      </div>
      <div style="margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between;margin: 40px 0;">
          <div style="border-radius: 10px; padding: 5px 15px; flex-basis: 25%; line-height: 15px">
            <p style="font-size:20px; color: ${color}">${
              toReceive > toPay ? 'To Receive' : 'To Pay'
            }</p>
            <h3 style="font-size:22px;">${balance.toFixed(2)}  ₹</h3>
          </div>
        </div>
        <table style="width: 100%; border-collapse: separate;">
          <thead>
            <tr style="border-top: 1px solid darkgray">
              <th style="padding: 15px 8px; text-align: left; border-bottom: 1px solid #ddd;">Date</th>
              <th style="padding: 15px 8px; text-align: left; border-bottom: 1px solid #ddd;">Transaction Type</th>
              <th style="padding: 15px 8px; text-align: left; border-bottom: 1px solid #ddd;">Given</th>
              <th style="padding: 15px 8px; text-align: left; border-bottom: 1px solid #ddd;">Received</th>
              <th style="padding: 15px 8px; text-align: left; border-bottom: 1px solid #ddd;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
          <tfoot>
            <tr style="border-bottom: 1px solid darkgray">
              <td></td>
              <td style="text-align: left; font-weight: bold;">Total:</td>
              <td style="padding: 15px 0;font-weight: bold;">${toReceive} ₹</td>
              <td style="padding: 15px 0;font-weight: bold;">${toPay} ₹</td>
            <td style="padding: 15px 0;font-weight: bold;"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  async function execute() {
    const options = {
      mimeType: 'application/pdf',
      dialogTitle: 'Share PDF',
      UTI: 'com.adobe.pdf',
      name: 'custom-filename.pdf', // Specify the custom filename here
    };
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, options);
  }

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View className="flex-1 bg-blue-50">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View className="flex-1 p-2">
            <HTMLCodeView ref={htmlCodeViewRef} htmlCode={html} />
          </View>
          {Platform.OS === 'ios' && (
            <View>
              {selectedPrinter ? (
                <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
              ) : null}
            </View>
          )}
          <View className=" bg-white flex flex-row pb-10 items-center justify-evenly pt-4">
            <TouchableOpacity
              className={'d-flex justify-center items-center gap-2'}
              onPress={execute}
            >
              <MaterialIcons name="share" size={24} color="dodgerblue" />
              <Text>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={'d-flex justify-center items-center gap-2'}
              onPress={print}
            >
              <MaterialIcons name="print" size={24} color="black" />
              <Text>Print</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                className={'d-flex justify-center items-center gap-2'}
                onPress={selectPrinter}
              >
                <AntDesign name="select1" size={24} color="black" />
                <Text>Select</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ShareScreen;
