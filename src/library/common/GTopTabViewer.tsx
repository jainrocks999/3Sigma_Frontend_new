import {View, StyleSheet, ViewStyle, Text} from 'react-native';
import React from 'react';
import {moderateScale} from '../../resources/responsiveLayout';
import {FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

export interface Route {
  name: string;
  label?: string;
  component: Element;
  params?: object;
}
export interface GTopTabViewerProps {
  routes: Array<Route>;
  initialRouteName: string;
  onTabPress?: (itemName: string) => void;
  tabBarStyle?: ViewStyle;
}
const Tab = createMaterialTopTabNavigator();

const GTopTabViewer = ({
  routes,
  initialRouteName,
  onTabPress,
  tabBarStyle = {},
}: GTopTabViewerProps) => {
  return (
    <View style={styles.tabWrapper}>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarStyle: [styles.tabBarStyle, tabBarStyle],
          tabBarItemStyle: styles.tabBarItemStyle,
          lazy: true,
          swipeEnabled: false,
        }}>
        {routes.map((_item, index) => (
          <Tab.Screen
            key={index}
            listeners={{
              tabPress: _e => {
                onTabPress && onTabPress(_item.name);
              },
            }}
            initialParams={_item?.params || {}}
            name={_item.name}
            component={_item.component}
            options={{
              tabBarLabel: ({focused, color}) => (
                <Text
                  style={[
                    styles.tabBarLabelStyle,
                    {color: focused ? R.colors.themeCol2 : R.colors.themeCol1},
                  ]}>
                  {_item.label || _item.name}
                </Text>
              ),
              tabBarIndicatorStyle: styles.indicator,
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

export const styles = StyleSheet.create({
  tabWrapper: {flex: 1},
  tabBarStyle: {
    backgroundColor: R.colors.bgCol,
    paddingVertical: moderateScale(5),
  },
  tabBarLabelStyle: {
    ...R.generateFontStyle(13, FontWeightEnum.BOLD),
    textTransform: 'capitalize',
    width: '100%',
    textAlign: 'center',
    height: 30,
    paddingVertical: 5,
  },
  tabBarItemStyle: {
    padding: 0,
  },
  indicator: {
    height: 3,
    borderRadius: 50,
    backgroundColor: R.colors.themeCol2,
  },
});

export default GTopTabViewer;
