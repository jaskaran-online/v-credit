import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  alignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashListContainer: { flex: 1, height: '100%', width: '100%' },
  listFooter: {
    height: 100,
  },
  searchBarInputStyle: {
    fontSize: 12,
    lineHeight: Platform.OS === 'android' ? 16 : 0,
    paddingBottom: 20,
  },
  searchBarStyle: {
    backgroundColor: 'transparent',
    width: '100%',
  },
});
