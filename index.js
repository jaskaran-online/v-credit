import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import { LogBox, Text, TextInput } from 'react-native';
import { enGB, registerTranslation } from 'react-native-paper-dates';

import App from './app';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
registerTranslation('en-GB', enGB);

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['Require cycle: node_modules/']);
