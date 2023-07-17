import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useTotalTransactionData } from '../../apis/useApi';
import { useAuth } from '../../hooks';
import FloatingButtons from '../Components/FloatingButton';
import { TabNavigator } from '../Components/TabNavigator';
import { TwoCards } from '../Components/TwoCards';

export default function Index({ navigation }) {
  const auth = useAuth.use?.token();
  const { mutate: cardRequest, data: cardData } = useTotalTransactionData();

  function makeApiCall() {
    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    cardRequest(formData);
  }

  useFocusEffect(
    useCallback(() => {
      makeApiCall();
    }, []),
  );

  return (
    <View className='flex-1 bg-white'>
      <StatusBar animated={true} />
      <TwoCards
        toPay={cardData?.data?.toPay}
        toReceive={cardData?.data?.toReceive}
      />
      <View className={'flex-1'}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
}
