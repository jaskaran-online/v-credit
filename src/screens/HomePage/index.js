import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { withTheme } from 'react-native-paper';
import { TabNavigator } from '../Components/TabNavigator';
import { TwoCards } from '../Components/TwoCards';
import {
  useCustomerTransactionData,
  useTotalTransactionData,
} from '../../apis/useApi';
import { memo, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { focusManager } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import FloatingButtons from '../Components/FloatingButton';

function Index({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      loadCustomerData();
      return () => {
        // Useful for cleanup functions
        // console.log("Screen was unfocused");
      };
    }, []),
  );

  const auth = useAuth.use?.token();
  const { mutate, data, isLoading } = useTotalTransactionData();
  function loadCustomerData() {
    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    mutate(formData);
  }

  useEffect(() => {
    loadCustomerData();
  }, []);

  return (
    <View className='flex-1 bg-white'>
      <StatusBar animated={true} />
      <TwoCards toPay={data?.data?.toPay} toReceive={data?.data?.toReceive} />
      <View className={'flex-1'}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
}

export default withTheme(Index);
