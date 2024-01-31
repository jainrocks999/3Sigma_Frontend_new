import React, {FunctionComponent} from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

export interface ExpandingDotProps {
  activeDotColor?: string;
  containerStyle?: ViewStyle;
  data: Array<any>;
  dotStyle: ViewStyle;
  expandingDotWidth?: number;
  inActiveDotColor?: string;
  inActiveDotOpacity?: number;
  scrollX: Animated.Value;
}

const ExpandingDot: FunctionComponent<ExpandingDotProps> = ({
  activeDotColor,
  containerStyle,
  data,
  dotStyle,
  expandingDotWidth,
  inActiveDotColor,
  inActiveDotOpacity,
  scrollX,
}: ExpandingDotProps) => {
  const {width} = useWindowDimensions();

  const defaultProps = {
    inActiveDotColor: inActiveDotColor || '#000',
    inActiveDotOpacity: inActiveDotOpacity || 0.5,
    expandingDotWidth: expandingDotWidth || 20,
    dotWidth: (dotStyle.width as number) || 10,
    activeDotColor: activeDotColor || '#347af0',
  };

  return (
    <View style={[styles.containerStyle, containerStyle]}>
      {data.map((_data, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const colour = scrollX.interpolate({
          inputRange,
          outputRange: [
            defaultProps.inActiveDotColor,
            defaultProps.activeDotColor,
            defaultProps.inActiveDotColor,
          ],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [
            defaultProps.inActiveDotOpacity,
            1,
            defaultProps.inActiveDotOpacity,
          ],
          extrapolate: 'clamp',
        });
        const expand = scrollX.interpolate({
          inputRange,
          outputRange: [
            defaultProps.dotWidth,
            defaultProps.expandingDotWidth,
            defaultProps.dotWidth,
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={`dot_${index}`}
            style={[
              styles.dotStyle,
              dotStyle,
              {width: expand},
              {opacity},
              {backgroundColor: colour},
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dotStyle: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 5,
    width: 10,
  },
});

export default ExpandingDot;
