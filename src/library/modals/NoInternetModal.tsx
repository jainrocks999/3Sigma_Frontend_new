import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import R from 'resources/R';
import GText from '../common/GText';
import GModal, {GModalProps} from '../wrapper/GModal';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

const NoInternetModal: FunctionComponent<Partial<GModalProps>> = ({
  isVisible,
}: Partial<GModalProps>) => {
  return (
    <GModal isVisible={isVisible} onModalHide={() => void 0}>
      <View style={[styles.main]}>
        <GText style={styles.messageText}>Ops! Internet connetion lost</GText>
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: R.colors.whiteScreen,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    height: 400,
    paddingHorizontal: R.LayoutSizeEnum.XL,
    paddingVertical: R.LayoutSizeEnum.LG,
    position: 'absolute',
    width: '100%',
  },
  messageText: {
    alignSelf: 'center',
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.white,
  },
});

export default NoInternetModal;
