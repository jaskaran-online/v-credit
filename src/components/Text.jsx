import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const TextMedium = ({ variant, className, children, fontSize }) => {
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
  });

  console.log(fontsLoaded);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View onLayout={onLayoutRootView}>
      <Text
        variant={variant}
        className={className}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontFamily: 'sans-serif-medium',
        }}>
        {children}
      </Text>
    </View>
  );
};

export default TextMedium;
