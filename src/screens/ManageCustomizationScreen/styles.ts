import {StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import R from 'resources/R';
export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: R.colors.bgCol,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemWrapper: {
    marginBottom: 10,
    backgroundColor: R.colors.white,
    paddingVertical: moderateScale(15),
    paddingHorizontal: 15,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 4,
  },
  labelsImageStyles: {
    height: moderateScale(18),
    width: moderateScale(18),
  },
  textWrapper: {},
  titleText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
  },

  tagline: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.black,
    marginBottom: 10,
    marginTop: 10,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
  },
  arrowNavigationWrapper: {
    marginRight: 10,
  },
  headerWrapper: {
    flex: 1,
    marginVertical: moderateScale(10),
    paddingHorizontal: moderateScale(-20),
  },
  circleBtn: {
    borderRadius: 20,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  leadItemOuter: {
    backgroundColor: R.colors.white,
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(15),
    overflow: 'hidden',
  },
  leadTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonWrapper: {
    padding: moderateScale(20),
  },
  iconWrapper: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nameContainer: {
    flex: 0.9,
  },
  btnContainer: {
    height: 80,
    justifyContent: 'center',
    backgroundColor: R.colors.bgCol,
  },
  innerContainer: {flex: 1, paddingBottom: 80},
});
