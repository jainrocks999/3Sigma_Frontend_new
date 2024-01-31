/* eslint-disable react-hooks/exhaustive-deps */
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {isFunction, isNil} from 'lodash-es';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  NativeEventSubscription,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import R from 'resources/R';
import commonStyles from '../../screens/commonStyles';
import platformUtil from '../../utils/platform.util';
import Loader from '../common/Loader';
import NoInternetModal from '../modals/NoInternetModal';

export interface GScreenProps {
  disableBack?: boolean;
  hasKeyboardAvoidView?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: StyleProp<ViewStyle>;
  backHandlerCallback?: () => boolean;
  screenFocusCallback?: (isFocused: boolean) => void;
  backgroundImage?: any;
}

const GScreen: FunctionComponent<PropsWithChildren<GScreenProps>> = ({
  children,
  disableBack,
  hasKeyboardAvoidView = false,
  style,
  loading = false,
  loadingText = '',
  backHandlerCallback,
  screenFocusCallback,
  backgroundImage = null,
}: PropsWithChildren<GScreenProps>) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [isNoInternetVisible, setNoInternetVisible] = useState<boolean>(false);
  const [keyboardScreenPadding, setKeyboardScreenPadding] = useState<number>();

  const isCurrentScreenFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      const backHandler: NativeEventSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isFunction(backHandlerCallback)) {
            return backHandlerCallback();
          }
          if (!disableBack) {
            return false;
          }
          return !!disableBack;
        },
      );

      return () => {
        backHandler.remove();
      };
    }, [disableBack, backHandlerCallback]),
  );

  useEffect(() => {
    if (!isNil(isCurrentScreenFocused) && screenFocusCallback) {
      screenFocusCallback(isCurrentScreenFocused);
    }
  }, [isCurrentScreenFocused]);

  useEffect(() => {
    // React native bug: If the screen and window height does not match then KeyboardAvoidingView bottom
    // is hidden behind keyboard for about screen's header (usually camera) height
    const windowHeight = Dimensions.get('window').height;
    const screenHeight = Dimensions.get('screen').height;
    const unusedScreenHeight = Math.ceil(screenHeight - windowHeight);
    setKeyboardScreenPadding(unusedScreenHeight / 2);

    const keyboardWillShowSub = Keyboard.addListener(
      platformUtil.isIOSPlatform() ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardWillHideSub = Keyboard.addListener(
      platformUtil.isIOSPlatform() ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    const netInfoSubscriber = NetInfo.addEventListener(state => {
      setNoInternetVisible(!state.isConnected);
    });

    // TODO: Should we handle it @ GFeatureScreen?

    return () => {
      netInfoSubscriber();
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={platformUtil.isIOSPlatform() ? 'padding' : 'height'}
        enabled={isNil(hasKeyboardAvoidView) || hasKeyboardAvoidView}
        style={[styles.screenContainer, style]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {backgroundImage ? (
              <ImageBackground
                source={backgroundImage}
                resizeMode="stretch"
                style={commonStyles.imageBackground}>
                {children}
              </ImageBackground>
            ) : (
              children
            )}
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <NoInternetModal
        isVisible={isNoInternetVisible}
        onModalHide={() => setNoInternetVisible(false)}
      />
      <Loader isVisible={loading} message={loadingText || ''} />
    </>
  );
};

export default GScreen;
const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: R.colors.bgCol,
    flex: 1,
  },
});
