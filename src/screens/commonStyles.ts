import {StyleSheet} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBarLable: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
  },
  tabBarStyle: {backgroundColor: '#FFF'},
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageBackground: {
    flex: 1,
    height: '100%',
  },
  imageBackgroundCenterContent: {
    flex: 1,
    justifyContent: 'center',
  },
  versionText: {
    color: 'rgba(49,49,49,1)',
    fontSize: 42,
    lineHeight: 84,
    textAlign: 'center',
  },
  dotContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  dotStyle: {
    borderRadius: 15,
    height: 15,
    marginHorizontal: 3,
    width: 15,
    borderWidth: 1,
    borderColor: '#46b5be',
  },
  sliderFlatList: {
    borderWidth: 1,
  },
  pageHeading: {
    color: '#46b5be',
  },
  h1: {
    color: '#46b5be',
    fontSize: FontSizeEnum.XL6,
  },
  h2: {
    color: '#46b5be',
    ...R.generateFontStyle(FontSizeEnum.XL3, FontWeightEnum.SEMI_BOLD),
    paddingVertical: 5,
  },
  h3: {
    color: '#46b5be',
    fontSize: FontSizeEnum.XL,
  },
  h4: {
    color: '#46b5be',
    fontSize: FontSizeEnum.BASE,
  },
  h5: {
    color: '#46b5be',
    fontSize: FontSizeEnum.XS,
  },
  h6: {
    color: '#46b5be',
    fontSize: FontSizeEnum.XXS,
  },
  p: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.REGULAR),
    color: '#707070',
    paddingHorizontal: 25,
  },
  centerAlign: {
    textAlign: 'center',
  },
  rightAlign: {
    textAlign: 'center',
  },
  leftAlign: {
    textAlign: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 40,
  },

  screen: {
    justifyContent: 'center',
    flex: 1,
  },
  marginVertical: {
    marginVertical: 20,
  },
  sreenWrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
export default commonStyles;
