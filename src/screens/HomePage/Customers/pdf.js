import React, { useRef } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import HTMLCodeView from './HTMLCodeView';
import * as Print from 'expo-print';

const ShareScreen = () => {


  const htmlCodeViewRef = useRef(null);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Invoice</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin: 0;">Invoice</h1>
      </div>
      <div style="margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="flex-basis: 50%;">
            <h3>From:</h3>
            <p>Your Company Name</p>
            <p>Your Address</p>
            <p>Your City, State, ZIP</p>
            <p>Your Email</p>
          </div>
          <div style="flex-basis: 50%;">
            <h3>To:</h3>
            <p>Client Name</p>
            <p>Client Address</p>
            <p>Client City, State, ZIP</p>
            <p>Client Email</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Description</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product 1</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">2</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$10.00</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$20.00</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product 2</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">1</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$15.00</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$15.00</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product 3</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">3</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$8.00</td>
              <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">$24.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
              <td>$59.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </body>
  </html>
  `;

  async function execute() {
    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri);
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
    <View className="flex-1 bg-slate-100">
        <View className="flex-1 bg-slate-100">
          <HTMLCodeView ref={htmlCodeViewRef} htmlCode={html}/>
        </View>
        {Platform.OS === 'ios' &&
        <View>
        {selectedPrinter ? (<Text>{`Selected printer: ${selectedPrinter.name}`}</Text>) : null}
        </View>
        }
        <View className=" bg-slate-100 flex flex-row mb-10 items-center justify-evenly pt-4">
          <Button mode="contained" buttonColor='green'  onPress={execute}>Share</Button>
          {Platform.OS === 'ios' && (
                <Button mode='contained' buttonColor='orange' onPress={selectPrinter}>Select printer</Button>
            )}
          <Button mode="contained" buttonColor='dodgerblue' onPress={print}>Print</Button>
        </View>
    </View>
  );
};

export default ShareScreen;
