import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function getItem(key) {
  const value = await SecureStore.getItemAsync(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem(key, value) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function removeItem(key) {
  await SecureStore.deleteItemAsync(key);
}

export function openLinkInBrowser(url) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export const createSelectors = (_store) => {

  let store = _store;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use)[k] = () => store((s) => s[k]);
  }

  return store;
};