import {Dimensions, Platform, StyleSheet} from 'react-native';
import R from 'resources/R';
import fonts from '../../resources/fonts/fonts';
import {FontSizeEnum, FontWeightEnum} from '../../resources/fonts/fontStyles';
import {moderateScale} from '../../resources/responsiveLayout';

const styles = StyleSheet.create({
  animatedsearch: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 999,
    width: '100%',
    backgroundColor: R.colors.bgCol,
    borderBottomColor: R.colors.InputGrey3,
    paddingHorizontal: 20,
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
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  searchTextInput: {
    height: '100%',
    width: '85%',
    color: 'black',
    marginLeft: 10,
    paddingRight: 10,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  filterBtnText: {
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginLeft: 5,
  },
  activeBtnText: {
    color: 'white',
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 5,
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
  filterBtn: {
    borderRadius: 15,
    backgroundColor: R.colors.stroke2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotateIcon: {
    transform: [{rotate: '45deg'}],
    position: 'absolute',
  },
  rotateIconY: {
    transform: [{rotate: '-45deg'}],
    position: 'absolute',
  },
  activeFilterBtn: {
    borderRadius: 15,
    backgroundColor: R.colors.themeCol2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  searchItem: {marginRight: 5, marginBottom: 10},
  justifyContainer: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: R.colors.bgCol,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: moderateScale(10),
  },
  headerWrapper: {
    margin: moderateScale(20),
  },
  headerTitle: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    maxWidth: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    fontFamily: fonts.bold,
    color: 'black',
    fontSize: 26,
    // paddingVertical: 10,
    alignSelf: 'center',
  },
  addListText: {
    fontFamily: fonts.bold,
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
  addList: {
    backgroundColor: R.colors.themeCol2,
    maxHeight: 40,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  modalContainer: {height: Dimensions.get('screen').height * 0.8},
  headerTitleSub: {
    color: R.colors.themeCol1,
    fontFamily: fonts.bold,
    fontSize: 30,
  },
  searchConatiner: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  HeaderIcon: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 40,
    width: 40,
    padding: 5,
  },
  HeaderTourIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: -5,
    height: 50,
    width: 50,
  },
  circleContainer: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shadowHigh: {
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
  bottomBar: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    height: 85,
  },
  logoLabelContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  tabIconStyle: {
    height: 23,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginTop: 10,
  },
  labelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    marginTop: 20,
  },
  equaltxt: {
    color: R.colors.black,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  applyBtn: {
    width: '100%',
    height: 58,
    backgroundColor: R.colors.themeCol2,
  },
  totalCenter: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  noListText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  btnAddText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'white',
    alignSelf: 'center',
  },
  next50: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: R.colors.themeCol2,
  },
  unselect: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: R.colors.themeCol2,
  },
  myListCompo: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: R.colors.bgCol,
    padding: 5,
    maxWidth: '100%',
  },
  listCount: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'black',
    maxWidth: '80%',
  },
  headerlistItem: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: R.colors.textCol1,
    padding: 5,
    maxWidth: '100%',
  },
  listTxt: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'black',
    fontSize: 16,
    padding: 10,
    maxWidth: '80%',
  },
  addFirstListBtn: {
    backgroundColor: R.colors.themeCol2,
    maxHeight: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listFooter: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listFooterlabelStyle: {
    fontSize: 14,
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    marginLeft: 5,
  },
  ModalCloseBtn: {
    height: 35,
    width: 35,
    borderRadius: 60,
    backgroundColor: '#00000041',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalFilterCloseBtn: {
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  s1BtnLabels: {
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  header: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.labelCol1,
    marginHorizontal: 20,
  },
  RightCircle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListItemCnt: {
    paddingHorizontal: 20,
    marginVertical: 20 / 2.5,
    // width: '100%',
    minHeight: 40,
  },
  ListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
  },
  leftBox: {
    height: 45,
    width: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
  neuShadowTop: {
    shadowColor: '#c3cad4',
    shadowOffset: {
      width: 8,
      height: -6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  neuShadowBottom: {
    shadowColor: '#ffffff',
    shadowOffset: {
      width: -6,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  logContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadOuter: {
    flexDirection: 'row',
    marginTop: 5,
    maxWidth: '100%',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  outerStatus: {
    marginRight: 5,
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#061840',
    marginBottom: 5,
  },
  itemBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 5,
  },
  itemSwitch: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },

  itemView: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  title: {
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  image: {
    height: 70,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginLeft: 20,
  },
  bulkContainer: {marginHorizontal: 20, marginBottom: 10},
  bulkContainerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: R.colors.themeCol2,
    alignItems: 'center',
  },
  bulkText: {
    paddingVertical: 10,
    textAlign: 'center',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
  },
  hoverBtn: {
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    opacity: 1,
  },
  scrolllToTopConatiner: {
    position: 'absolute',
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {bottom: 45},
      android: {bottom: 25},
    }),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 40,
  },
  scrolllToTop: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.themeCol2,
    zIndex: 99,

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 35,
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
  scrolllToTopIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrolllToTopText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: 'white',
  },
  leadListCardConatiner: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
  },
  leadListCardLeftConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  itemContainer: {
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  leadNameText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
  },
  leadListCardLabel: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
  leadListCardTimeText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    fontSize: 12,
    marginTop: 6,
  },
  leadListCardRightConatiner: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addMenuContainer: {
    padding: 10,
    // backgroundColor:'red',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentOuter: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    fontSize: 18,
  },
  closeOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
  },
  activity: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actiVityContainer: {
    flex: 1,
    backgroundColor: R.colors.white,
  },
  leadHomeWarper: {flex: 1, backgroundColor: R.colors.white},
  addMapTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchWrapper: {
    paddingRight: moderateScale(15),
  },
  switchStyle: {},
  addTagsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    marginVertical: moderateScale(15),
  },
  tagWrapper: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
  },
  fileUploadHeader: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTitles: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.labelCol1,
    width: moderateScale(110),
  },
  fieldHeadTitles: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.labelCol1,
  },
  dropdownWrapper: {width: '50%'},
});
export default styles;
