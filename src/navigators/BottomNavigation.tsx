import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import _route from '../configs/routes';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import ScreenNameEnum from '../models/routes/screenName.enum';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

const inactiveColor = 'grey';

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const _openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <BottomTab.Navigator
      initialRouteName="LeadHome"
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: '#3FAEFD',
        tabBarInactiveTintColor: '#061740',
        headerShown: false,
        lazy: true,
      }}>
      {_route.BOTTOM_ROUTE.map(route => (
        <BottomTab.Screen
          key={route.name}
          name={route.name}
          options={{
            lazy: true,
            title: route.title,
            tabBarLabel: ({focused, color}) => (
              <Text
                style={[
                  styles.tabBarLabel,
                  {color: focused ? R.colors.themeCol2 : inactiveColor},
                ]}>
                {route.title}
              </Text>
            ),
            tabBarIcon: ({focused, title}) => (
              <View style={styles.iconBox}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={route.icon}
                    size={25}
                    color={focused ? R.colors.themeCol2 : inactiveColor}
                  />
                </View>
                <Text
                  style={[
                    styles.tabBarLabel,
                    {color: focused ? R.colors.themeCol2 : inactiveColor},
                  ]}>
                  {title}
                </Text>
              </View>
            ),
          }}
          listeners={{
            tabPress: e => {
              // if (e.target?.includes(ScreenNameEnum.SETTINGS_TAB_SCREEN)) {
              //   e.preventDefault();
              //   _openDrawer();
              //   return;
              // } else if (!e.target) {
              //   e.preventDefault();
              //   return;
              // }
            },
          }}
          component={route.Component}
        />
      ))}
    </BottomTab.Navigator>
  );
};
function MyTabBar({state, descriptors, navigation}) {
  return (
    <View style={styles.barStyle}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            key={index}
            onLongPress={onLongPress}
            style={styles.tabItem}>
            <View
              style={isFocused ? styles.iconStyleSolid : styles.iconStyle}
            />
            {options.tabBarIcon({focused: isFocused, title: options.title})}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default BottomTabNavigator;
const styles = StyleSheet.create({
  iconStyle: {
    borderColor: 'transparent',
    borderWidth: 2,
    minWidth: 30,
    borderRadius: 10,
  },
  tabItem: {flex: 1, alignItems: 'center'},
  iconStyleSolid: {
    borderColor: R.colors.themeCol2,
    borderWidth: 2,
    minWidth: 30,
    borderRadius: 10,
  },
  iconBox: {
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  barStyle: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarLabel: {
    ...R.generateFontStyle(FontSizeEnum.XXS, FontWeightEnum.BOLD),
    textTransform: 'capitalize',
    minWidth: '100%',
    textAlign: 'center',
  },
  tabBarIndicatorStyle: {
    height: 5,
    top: 0,
    borderRadius: 10,
    width: 30,
    alignSelf: 'center',
    marginLeft: 25,
    backgroundColor: R.colors.themeCol2,
  },
  iconContainer: {
    alignItems: 'center',
  },
});
