import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import GModal from '../wrapper/GModal';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import Button from '../common/ButtonGroup';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {setAutoDialerDuration} from '../../store/slices/lead.slice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface AutoDialerSettingProps {
  isVisible: boolean;
  onModalHide: () => void;
}
const AutoDialerSettingModal = ({
  isVisible,
  onModalHide,
}: AutoDialerSettingProps) => {
  const dispatch = useDispatch<RootDispatch>();
  const {countDownTimer} = useSelector(
    (state: RootState) => state.lead.autoDialingMetaData,
  );
  const [countDown, setcountDown] = useState<number>(countDownTimer);

  return (
    <GModal isVisible={isVisible} onModalHide={onModalHide}>
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>Auto dialler setttings</Text>
        </View>
        <View>
          <Text style={styles.headerText}>Countdown</Text>
          <Text style={styles.descriptionText}>
            Select the delay between calls (seconds)
          </Text>
          <View style={styles.quantityPicker}>
            <View style={styles.circleBtn}>
              <Pressable
                onPress={() => {
                  if (countDown > 0) {
                    setcountDown(countDown - 1);
                  }
                }}
                android_ripple={R.darkTheme.grayRipple}
                style={styles.circleBtnInner}>
                <MaterialCommunityIcons
                  name={'minus'}
                  color={R.colors.themeCol2}
                  size={20}
                />
              </Pressable>
            </View>
            <Text style={styles.quantityText}>{countDown}</Text>
            <View style={styles.circleBtn}>
              <Pressable
                onPress={() => setcountDown(countDown + 1)}
                android_ripple={R.darkTheme.grayRipple}
                style={styles.circleBtnInner}>
                <MaterialCommunityIcons
                  name={'plus'}
                  color={R.colors.themeCol2}
                  size={20}
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.playerContainer}>
          <Button
            buttonStyle={styles.buttonStyle}
            label={'Save'}
            onPress={() => {
              dispatch(setAutoDialerDuration(countDown));
              onModalHide();
            }}
          />
        </View>
      </View>
    </GModal>
  );
};
export default AutoDialerSettingModal;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  playerContainer: {
    backgroundColor: R.colors.lightgray,
  },
  buttonStyle: {
    backgroundColor: R.colors.themeCol6,
    borderRadius: 10,
  },
  headerText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginBottom: 10,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.themeCol1,
    marginBottom: 10,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  circleBtnInner: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtn: {
    borderRadius: 20,
    height: 35,
    width: 35,
    overflow: 'hidden',
    backgroundColor: R.colors.InputGrey4,
  },
  quantityText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    minWidth: 30,
    textAlign: 'center',
  },
});
