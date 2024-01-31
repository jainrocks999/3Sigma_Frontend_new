import { Platform, StyleSheet } from 'react-native';
import { FontSizeEnum, FontWeightEnum } from 'resources/fonts/fontStyles';
import R from 'resources/R';
import { moderateScale } from '../../resources/responsiveLayout';

export const styles = StyleSheet.create({
  mainConatiner: {
    backgroundColor: R.colors.bgCol,
    flex: 1,
  },
  backButtonWrapper: {
    padding: moderateScale(15),
  },
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    alignItems: 'center',
    width: '90%',
    paddingVertical: 0,
    justifyContent: 'center',
    marginBottom: 30,
  },
  glogoStyle: {
    height: 22,
    width: 22,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  editBtn: { position: 'absolute', right: -25, top: 2 },
  inputContainer: {
    paddingLeft: 16,
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flOne: { flex: 1 },
  inputStyle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: 'black',
  },
  iconStyle: { position: 'absolute', right: moderateScale(1) },
  s2Txt1: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    textAlign: 'center',
    lineHeight: 46,
  },
  s2Txt2: {
    marginTop: moderateScale(20),
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    textAlign: 'center',
  },
  s4Txt1: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    textAlign: 'center',
  },
  s4Txt2: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol2,
    marginTop: 3,
  },
  s4Txt4: {
    color: 'grey',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    marginTop: 3,
  },
  s4Txt3: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    color: '#000',
    width: 20,
    textAlign: 'center',
  },
  s5Btn: {
    width: '100%',
    borderRadius: 18,
    height: 58,
  },
  s5BtnLabel: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    color: 'white',
    fontSize: 18,
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
  underlineStyleBase: {
    height: 70,
    width: 40,
    borderWidth: 0,
    borderBottomWidth: 1.5,
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
  },
  underlineStyleHighLighted: {
    borderColor: R.colors.themeCol1,
  },
  secondText: {
    marginLeft: -5,
    fontSize: 12,
  },
  flCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reSend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  logo: {
    width: 50,
    aspectRatio: 1,
  },
  logoText: {
    fontSize: 40,
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
  },
  logoTextShadow: {
    textShadowColor: 'white',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  s2Txt3: {
    marginTop: moderateScale(12),
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    textAlign: 'center',
  },
  s3PhoneIpCnt: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    marginVertical: 20,
  },
  s3PhoneIp: {
    width: '70%',
    backgroundColor: 'white',
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  s3Btn: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: R.colors.themeCol1,
  },
  s3BtnLabel: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    color: 'white',
  },

  s4Btn: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: R.colors.themeCol1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
  s5Txt1: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    marginTop: 20,
    maxWidth: '80%',
    textAlign: 'center',
  },
  s5Txt2: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol2,
    marginTop: 20 / 1.2,
  },
  termsText: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginBottom: 20,
  },
  termsTextLnk: {
    color: R.colors.themeCol2,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  appleBtnView: {
    width: 250,
    height: 45,
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 15
  },
});
