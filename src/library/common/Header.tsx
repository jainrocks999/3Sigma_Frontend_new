import React from 'react';
import {View, TouchableOpacity, Platform, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {goBack, canGoBack, reset} from '../../navigators/NavigationService';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import ScreenNameEnum from '../../models/routes/screenName.enum';

const Header = (props: any) => {
  const handleBack = () => {
    console.log('hello', canGoBack());
    if (canGoBack()) {
      goBack();
    } else {
      reset(ScreenNameEnum.LEAD_HOME_SCREEN, 0);
    }
  };
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {props.back && (
          <TouchableOpacity
            style={[styles.backBtn, styles.shadowLow]}
            onPress={() =>
              props.onBackPress ? props.onBackPress() : handleBack()
            }>
            <MaterialIcons
              name={'chevron-left'}
              size={25}
              color={R.colors.labelCol1}
            />
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.leftContainer}>{props.left}</View>
        {props.right ? (
          <View style={styles.rightContainer}>{props.right}</View>
        ) : (
          <View style={styles.rightPadding} />
        )}
      </View>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    ...Platform.select({
      android: {
        paddingBottom: 0,
      },
    }),
    marginHorizontal: 10,
  },
  btnText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rightPadding: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  header: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  backBtn: {
    // height:10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    marginRight: 10,
  },
  shadowLow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
