import React, {PropsWithChildren} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

import {ConfirmationDialogProps} from '../../utils/tsModals';
import Button from '../common/ButtonGroup';
import GModal from '../wrapper/GModal';

const ConfirmationDialog = ({
  showDialog,
  onConfirm,
  confirmationMessage,
  children,
}: PropsWithChildren<ConfirmationDialogProps>) => {
  return (
    <GModal
      isVisible={showDialog}
      position={'center'}
      topBar={false}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onModalHide={() => onConfirm(false)}>
      <View style={styles.container}>
        <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
        {children && <View>{children}</View>}
        <View style={styles.flexRow}>
          <View style={styles.btnContainer}>
            <Button
              type={'default'}
              label={'YES'}
              buttonStyle={styles.btn}
              onPress={() => {
                onConfirm(true);
              }}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              type={'default'}
              label={'NO'}
              buttonStyle={styles.btn1}
              labelStyle={{color: R.colors.themeCol2}}
              onPress={() => onConfirm(false)}
            />
          </View>
        </View>
      </View>
    </GModal>
  );
};

export default ConfirmationDialog;
const styles = StyleSheet.create({
  container: {
    width: '75%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmationMessage: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginBottom: 20,
  },
  flexRow: {width: '100%', flexDirection: 'row'},
  btn: {
    borderRadius: 15,
    backgroundColor: R.colors.IndianRed,
    height: 45,
  },
  btn1: {
    borderRadius: 15,
    backgroundColor: '#fff',
    height: 45,
    borderWidth: 1,
    borderColor: R.colors.themeCol2,
  },
  btnContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});
