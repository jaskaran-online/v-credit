import { Image } from 'react-native';

export function Logo({ height = 150, width = 150, className = '', styles = {} }) {
  return (
    <Image
      source={require('../../../../assets/logo.png')}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ resizeMode: 'contain', height, width, ...styles }}
      className={`m-auto h-${height} w-${width}`}
    />
  );
}
