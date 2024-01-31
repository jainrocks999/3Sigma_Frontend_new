/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FunctionComponent,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';

import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import ExpandingDot from './ExpandingDot';
import R from 'resources/R';
import GText from './GText';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import FastImage from 'react-native-fast-image';
import Button from './ButtonGroup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface ItemDataType {
  index: number;
  item: any;
}
interface GCarouselProps {
  data: Array<any>;
  height?: number;
  fullWidth?: Boolean;
  contentContainerStyle?: any;
  onLoginPress?: () => void;
}
var CarouselIndex = 0;
const GCarousel: FunctionComponent<GCarouselProps> = (
  props: GCarouselProps,
) => {
  let {
    data,
    height = Dimensions.get('screen').height,
    contentContainerStyle = {},
    fullWidth = false,
  } = props;
  const [offers, setData] = useState(data);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const flatListRef = useRef<any>(null);

  const width = Dimensions.get('screen').width;
  useEffect(() => {
    setData(data);
  }, [data]);
  const scrollX = useRef<any>(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      gotoNextPage(CarouselIndex);
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const onViewRef = useRef<any>(({viewableItems}: any) => {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index);
      CarouselIndex = viewableItems[0].index;
    }
  });
  const viewConfigRef = useRef<any>({viewAreaCoveragePercentThreshold: 50});
  const renderItem = useCallback(
    ({index, item}: ItemDataType) => (
      <TouchableWithoutFeedback key={index} onPress={() => handleOnPress(item)}>
        <View style={styles.imageContainer}>
          <FastImage
            source={typeof item === 'string' ? item : item.image}
            resizeMode={item.resizeMode}
            style={[
              styles.itemContainer,
              {
                width: width - (fullWidth ? 0 : 40),
                height: height,
              },
            ]}
          />
          <View style={styles.textContainer}>
            <GText style={styles.bannerTitle}>{item?.title}</GText>
            <GText style={styles.detailText}>{item?.description}</GText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    [width, fullWidth, height],
  );

  const gotoNextPage = (nextIndex = 0) => {
    if (nextIndex + 1 < offers?.length) {
      flatListRef?.current?.scrollToIndex({
        index: nextIndex + 1,
        animated: true,
      });
    } else {
      flatListRef?.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };
  const gotoPrevPage = (prevIndex = 0) => {
    if (prevIndex > 0) {
      flatListRef?.current?.scrollToIndex({
        index: prevIndex - 1,
        animated: true,
      });
    } else {
      flatListRef?.current?.scrollToIndex({
        index: offers?.length - 1,
        animated: true,
      });
    }
  };
  const handleOnPress = (item: any) => {
    console.log('image pressed', item);
  };

  return (
    <View style={[styles.carouselContainer, contentContainerStyle]}>
      <FlatList
        data={offers ? offers : []}
        decelerationRate="normal"
        keyExtractor={item =>
          `${typeof item === 'string' ? item : item._id}_img`
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={onViewRef.current}
        pagingEnabled
        style={[styles.flatList, {height}]}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={renderItem}
        ref={flatListRef}
        viewabilityConfig={viewConfigRef.current}
      />
      <View style={styles.dotContainer}>
        <ExpandingDot
          activeDotColor={'#88bdfa'}
          data={offers}
          dotStyle={styles.dotStyle}
          expandingDotWidth={30}
          inActiveDotColor={'#f4f4f4'}
          inActiveDotOpacity={0.9}
          scrollX={scrollX}
        />
        {activeIndex < offers.length - 1 ? (
          <Button
            label={'CONTINUE'}
            buttonStyle={styles.btnStyle}
            labelStyle={styles.labelStyle}
            onPress={() => gotoNextPage(activeIndex)}
          />
        ) : (
          <Button
            label={'LOGIN'}
            buttonStyle={styles.btnStyle}
            labelStyle={styles.labelStyle}
            onPress={() => props.onLoginPress && props.onLoginPress()}>
            <View style={styles.loginBtn}>
              <MaterialCommunityIcons
                name={'chevron-right'}
                color={'white'}
                size={30}
              />
            </View>
          </Button>
        )}
      </View>
    </View>
  );
};

export default GCarousel;
const styles = StyleSheet.create({
  flatList: {},
  btnStyle: {
    borderRadius: 10,
    backgroundColor: R.colors.themeCol2,
    width: '100%',
  },
  labelStyle: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
  },
  itemContainer: {
    borderRadius: 5,
  },
  dotContainer: {
    alignItems: 'center',
    maxHeight: 100,
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  dotStyle: {
    borderRadius: 15,
    height: 12,
    marginHorizontal: 3,
    width: 18,
    borderWidth: 1,
    borderColor: R.colors.themeCol2,
    backgroundColor: R.colors.InputGrey1,
  },
  imageContainer: {
    borderRadius: 10,
    width: Dimensions.get('screen').width,
    flex: 1,
    justifyContent: 'space-between',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  detailText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.SEMI_BOLD),
    textAlign: 'center',
    color: R.colors.labelCol1,
    marginBottom: 20,
  },
  bannerTitle: {
    ...R.generateFontStyle(FontSizeEnum.XL2, FontWeightEnum.BOLD),
    textAlign: 'center',
    color: R.colors.themeCol1,
    marginBottom: 10,
  },

  textContainer: {
    marginHorizontal: 20,
  },
  loginBtn: {position: 'absolute', right: 20},
});
