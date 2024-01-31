import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';
import R from 'resources/R';
import useKeyboardHeight from '../hooks/keyboardHook';

export interface GModalProps extends Partial<ModalProps> {
  gradientContainerStyle?: StyleProp<ViewStyle>;
  showGradient?: boolean;
  showGradientCloseBtn?: boolean;
  topBar?: boolean;
  loading?: boolean;
  position?: 'bottom' | 'top' | 'center';
  closable?: boolean;
}

const GModal: FunctionComponent<GModalProps> = ({
  animationIn,
  animationOut,
  backdropColor,
  children,
  isVisible,
  position = 'bottom',
  style,
  onBackButtonPress,
  onModalHide,
  onModalWillHide,
  avoidKeyboard = false,
  topBar = true,
  closable = true,
  loading = false,
}: GModalProps) => {
  const keyboardHeight = useKeyboardHeight();

  const [modalStyle, setModalStyle] = useState<StyleProp<ViewStyle>>();

  useEffect(() => {
    let _modalStyle = {};

    if (position === 'top') {
      _modalStyle = styles.modalTopPosition;
    } else if (position === 'bottom') {
      _modalStyle = styles.modalBottomPosition;
    } else {
      _modalStyle = styles.modalCenterPosition;
    }

    setModalStyle(_modalStyle);
  }, [position, keyboardHeight]);
  const handleOnClose = () => {
    if (closable) {
      onModalHide && onModalHide();
    }
  };
  return (
    <Modal
      avoidKeyboard={avoidKeyboard}
      animationInTiming={200}
      animationOutTiming={200}
      swipeDirection={position === 'bottom' ? 'down' : 'up'}
      animationIn={animationIn}
      animationOut={animationOut}
      backdropColor={backdropColor}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      isVisible={isVisible}
      onBackButtonPress={onBackButtonPress ?? onModalHide}
      onBackdropPress={handleOnClose}
      onSwipeComplete={handleOnClose}
      onModalWillHide={onModalWillHide}
      style={[modalStyle, style]}>
      {topBar && position === 'bottom' ? (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={styles.closeBtn}>
            <View style={styles.border} />
          </View>
        </View>
      ) : null}
      {children}
      {topBar && position === 'top' ? (
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <View style={styles.closeBtnBottom}>
            <View style={styles.border} />
          </View>
        </View>
      ) : null}
      {loading && (
        <View style={styles.loaderView}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={R.colors.black} />
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  border: {
    width: 50,
    height: 4,
    backgroundColor: '#adadad',
    borderRadius: 5,
  },
  closeBtn: {
    alignSelf: 'center',
    marginBottom: -20,
    // backgroundColor: '#5e5e5e',
    width: '100%',
    alignItems: 'center',
    height: 35,
    padding: 5,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  closeBtnBottom: {
    marginTop: -20,
    // backgroundColor: '#5e5e5e',
    width: '100%',
    alignItems: 'center',
    height: 35,
    paddingTop: 20,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },

  modalBottomPosition: {
    bottom: 0,
    margin: 0,
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalTopPosition: {
    margin: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  modalCenterPosition: {
    borderRadius: 20,
    marginHorizontal: 10,
  },
  loaderView: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loaderContainer: {},
});

export default GModal;
