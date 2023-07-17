import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { BlurView } from 'expo-blur';

export default function FloatingButtons({ navigation, customer }) {
    return (
        <BlurView
            intensity={5}
            tint='light'
            className={
                'h-24 pt-5 flex w-full flex-row justify-evenly space-x-2 px-4'
            }
        >
            <View className={'flex-1'}>
                <Button
                    mode={'contained'}
                    onPress={() =>
                        navigation.navigate('TakeMoney', { customer })
                    }
                    className={'bg-sky-500'}
                >
                    Take Payment
                </Button>
            </View>
            <View className={'flex-1'}>
                <Button
                    mode={'contained'}
                    onPress={() =>
                        navigation.navigate('GiveMoney', { customer })
                    }
                    className={'bg-amber-500'}
                >
                    Give Credit
                </Button>
            </View>
        </BlurView>
    );
}
