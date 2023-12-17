import { Image } from 'react-native';

export function Logo() {
  return (
    <Image source={require('../../../../assets/logo.png')} className="m-auto h-[150] w-[150]" />
  );
}
