import {StyleSheet, Platform} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import {moderateScale} from '../../resources/responsiveLayout';
import R from 'resources/R';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  formContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  backButtonBox: {
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleHeaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScale(15),
  },
  teamsItem: {
    backgroundColor: R.colors.white,
    paddingVertical: 20 / 2.5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxContainer: {
    backgroundColor: R.colors.white,
    borderRadius: moderateScale(15),
    marginHorizontal: moderateScale(20),
    borderColor: R.colors.black,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    marginBottom: moderateScale(10),
    overflow: 'hidden',
  },
  nameText: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  shortDescription: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  smallText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
    textTransform: 'capitalize',
  },
  addButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: R.colors.black,
    position: 'absolute',
    bottom: moderateScale(25),
    right: moderateScale(13),
  },
  deleteButtonWrapper: {
    backgroundColor: R.colors.deleteButton,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(35),
    width: moderateScale(35),
    height: moderateScale(35),
  },
  titleWrapper: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  adButtonWrapper: {
    paddingHorizontal: moderateScale(20),
    marginVertical: moderateScale(20),
    zIndex: 999,
  },
  hoverBtn: {
    opacity: 1,
    position: 'relative',
    marginBottom: 10,
  },
  bottomFixedBtn: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
  },
});
