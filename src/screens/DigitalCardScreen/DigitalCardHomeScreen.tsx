import {useNavigation} from '@react-navigation/native';
import BackButton from 'library/common/BackButton';
import GScreen from 'library/wrapper/GScreen';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {moderateScale} from 'resources/responsiveLayout';
import {RootDispatch} from '../../store/app.store';
import ScreenNameEnum from '../../models/routes/screenName.enum';
import {getDigitalCard} from '../../store/slices/actions/DigitalCard';
import {currentUserSelector} from '../../store/slices/user.slice';
import {WebView} from 'react-native-webview';
import {EditButton, IconButton} from 'library/common/ButtonGroup';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import sInfoUtil from '../../utils/sInfo.util';

const DigitalCardHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<RootDispatch>();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(currentUserSelector);
  useEffect(() => {
    loadToken();
    dispatch(getDigitalCard());
  }, []);
  const loadToken = async () => {
    const _token = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
    setToken(_token);
  };
  console.log(
    `https://stageintegration.3sigmacrm.com/bussinessCard/${user._id}?token=${token}`,
  );
  return (
    <GScreen loading={loading}>
      <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <BackButton title={'Digital Card'} />

          <View style={styles.btnContainer}>
            <IconButton
              icon={'eye'}
              onPress={() =>
                Linking.openURL(
                  `https://stageintegration.3sigmacrm.com/bussinessCard/${user._id}?token=${token}`,
                )
              }
            />
            <EditButton
              onPress={() =>
                navigation.navigate(ScreenNameEnum.MANAGE_DIGITAL_CARD_SCREEN)
              }
            />
          </View>
        </View>
        <View style={styles.pdfContainer}>
          {token && (
            <WebView
              style={{borderWidth: 1, flex: 1}}
              onNavigationStateChange={event => {}}
              onLoadProgress={data => {}}
              onLoad={() => {
                console.log('loaded');
              }}
              source={{
                uri: `https://stageintegration.3sigmacrm.com/bussinessCard/${user._id}?token=${token}`,
              }}
            />
          )}
        </View>
      </View>
    </GScreen>
  );
};
export default DigitalCardHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButtonWrapper: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    paddingHorizontal: moderateScale(15),
    // padding: moderateScale(15),
  },
  optionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  optionButtonWrapper: {
    paddingHorizontal: moderateScale(4),
    paddingVertical: moderateScale(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.white,
    borderRadius: moderateScale(20),
    width: moderateScale(65),
    height: moderateScale(30),
  },
  customBtn: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.white,
    marginHorizontal: 10,
  },
  greenBtn: {
    backgroundColor: R.colors.green,
    marginRight: 5,
  },
  primaryBtn: {
    backgroundColor: R.colors.themeCol2,
    marginLeft: 5,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  pdfContainer: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height,
    backgroundColor: 'lightgray',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginHorizontal: 10,
  },
  btnContainer: {
    flexDirection: 'row',
  },
});
