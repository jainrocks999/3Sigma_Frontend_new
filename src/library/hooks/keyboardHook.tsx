import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import platformUtil from '../../utils/platform.util';

const useKeyboardHeight: any = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardDidShow = (event: any) => {
      setKeyboardHeight(event.endCoordinates.height);
    };
    const onKeyboardDidHide = () => {
      setKeyboardHeight(0);
    };

    const keyboardWillShowSub = Keyboard.addListener(
      platformUtil.isIOSPlatform() ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardDidShow,
    );
    const keyboardWillHideSub = Keyboard.addListener(
      platformUtil.isIOSPlatform() ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardDidHide,
    );
    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight;
