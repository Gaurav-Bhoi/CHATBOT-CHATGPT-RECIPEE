import {ToastAndroid} from 'react-native';
import {toastInterface} from '../Interface/interface';

export const toast: toastInterface = message => {
  return ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
