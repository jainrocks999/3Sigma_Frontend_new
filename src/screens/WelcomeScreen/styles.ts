import {StyleSheet} from 'react-native';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.colors.bgCol,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '97%',
  },
  sectionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
    marginLeft: 10,
  },
  loadingBlock: {
    flexDirection: 'row',
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
  },
});
