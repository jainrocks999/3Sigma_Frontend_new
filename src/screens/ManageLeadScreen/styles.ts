import {Platform, StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
  },
  sectionContainer: {
    alignItems: 'center',
    margin: 20,
    //   backgroundColor:"red"
  },
  s3Btn: {
    width: '100%',
    //padding: 20,
  },
  s1BtnLabel: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: 'white',
  },
  shadow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 20,
  },
  s3PhoneIpCnt: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
  },
  s3PhoneIp: {
    width: '70%',
    backgroundColor: 'white',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: 'black',
  },
});

export default styles;
