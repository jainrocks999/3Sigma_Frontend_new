import {StyleSheet} from 'react-native';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import {moderateScale} from '../../resources/responsiveLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  titleWrapper: {
    paddingHorizontal: moderateScale(15),
    // padding: moderateScale(15),
  },
  nameTitle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    marginBottom: moderateScale(5),
    fontWeight: '600',
  },
  priceTitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  rupeeSymbol: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.themeCol2,
  },
  leadCategoryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  leadCategoryInfo: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    // padding: moderateScale(10),
  },
  leadSubTitle: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
    paddingVertical: moderateScale(5),
    textTransform: 'uppercase',
  },
  status: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
    paddingVertical: moderateScale(5),
    textTransform: 'capitalize',
  },
  borderSeparation: {
    borderRightWidth: 1,
    borderRightColor: R.colors.stroke2,
  },
  activityWrapper: {
    flex: 1,
    backgroundColor: R.colors.white,
    borderTopLeftRadius: moderateScale(40),
    borderTopRightRadius: moderateScale(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
  iconButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: moderateScale(13),
  },
  optionButtonText: {
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
  actiVityContainer: {
    backgroundColor: R.colors.white,
    flex: 1,
  },
  activityItemWrapper: {
    padding: moderateScale(10),
    backgroundColor: R.colors.activityBackground,
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(9),
  },
  iconWrapper: {
    padding: moderateScale(8),
    borderRadius: moderateScale(7),
    marginRight: moderateScale(15),
  },
  contentWrapper: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
  },
  fileContent: {
    borderBottomWidth: 1,
    borderBottomColor: R.colors.black,
  },
  informationWrapper: {
    marginVertical: moderateScale(15),
  },
  leadTitle: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
  },
  leadInformation: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    marginTop: moderateScale(2),
  },
  noteDescription: {
    color: R.colors.white,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.BOLD),
    padding: moderateScale(10),
    backgroundColor: R.colors.themeCol2,
    borderRadius: moderateScale(8),
  },
  createdAt: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.stroke3,
    marginVertical: moderateScale(4),
    alignSelf: 'flex-end',
  },
  taskWrapperFlatList: {
    marginHorizontal: moderateScale(20),
  },
  taskItemMainWrapper: {
    flexDirection: 'row',
    marginVertical: moderateScale(10),
  },
  dateIconWrapper: {
    marginRight: moderateScale(15),
  },
  callIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: R.colors.themeCol2,
  },
  taskInformation: {
    backgroundColor: R.colors.disabledGrey,
    padding: moderateScale(10),
    width: '80%',
    borderRadius: moderateScale(15),
  },
  taskCallText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol2,
    marginVertical: moderateScale(2),
  },
  taskNameText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.black,
    marginVertical: moderateScale(2),
  },
  taskOwnerText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.black,
  },
  headerWrapper: {
    margin: moderateScale(20),
  },
  editItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  editIconWrapper: {
    marginLeft: moderateScale(8),
  },
  valuesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: moderateScale(25),
  },
  optionText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
  },
  tabBarStyle: {
    backgroundColor: 'white',
    borderBottomColor: R.colors.black,
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    paddingVertical: moderateScale(5),
  },
});
export default styles;
