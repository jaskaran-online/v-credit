import { Image } from 'react-native';

export function Logo({ height = 150, width = 150, className = '', styles = {} }) {
  return (
    <Image
      source={require('../../../../assets/logo.png')}
      style={{ resizeMode: 'contain', height, width, ...styles }}
      className={`m-auto h-${height} w-${width}`}
    />
  );
}
