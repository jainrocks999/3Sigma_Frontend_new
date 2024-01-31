import {StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import {moderateScale} from '../../resources/responsiveLayout';
import R from 'resources/R';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  backButtonBox: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    padding: moderateScale(20),
  },
  addLeadCont: {
    marginTop: -15,
  },
  addTagsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    marginVertical: moderateScale(15),
  },
  addMapTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchWrapper: {
    paddingRight: moderateScale(15),
  },
  switchStyle: {},
  adButtonWrapper: {
    paddingHorizontal: moderateScale(20),
    marginVertical: moderateScale(20),
  },
  titleHeaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(10),
    marginBottom: moderateScale(7),
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
  messageWrapper: {
    borderRadius: moderateScale(15),
    backgroundColor: R.colors.white,
    marginVertical: moderateScale(7),
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  messageWrapperInner: {
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 90,
  },
  messageTitle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    maxWidth: '70%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -10,
    maxWidth: '40%',
  },
  messageDescription: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.textCol2,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  addLeadText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol2,
    paddingVertical: 10,
    maxWidth: 150,
  },
  ownerDescription: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.REGULAR),
    color: R.colors.gray,
    flexWrap: 'wrap',
  },
  left: {
    height: 40,
    width: 40,
    backgroundColor: 'red',
    alignSelf: 'center',
    borderRadius: 15,
    flex: 1,
  },
  middle: {
    flex: 6,
    justifyContent: 'space-between',
  },
  right: {
    alignSelf: 'center',
    borderRadius: moderateScale(15),
    flex: 1.5,
    left: moderateScale(20),
  },
  check: {
    height: moderateScale(20),
    width: moderateScale(20),
    backgroundColor: 'green',
    top: moderateScale(15),
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    width: 100,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor:'green'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    height: '90%',
    width: '100%',
    top: '10%',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  titleHeaderWrapperQuotation: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(10),
    marginBottom: moderateScale(7),
  },
  divider: {
    height: 3,
    backgroundColor: 'gray',
    margin: 12,
  },
  keyView: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    color: 'grey',
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    margin: 18,
  },
  containerStyle: {
    marginHorizontal: 20,
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
