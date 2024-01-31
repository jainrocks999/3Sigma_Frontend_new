/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ColorValue,
} from 'react-native';

export default function GListItem(props: {
  canBulkSelect?: any;
  activeOpacity?: number | undefined;
  isView?: boolean | undefined;
  innerStyle?: object | undefined;
  onPress: () => any;
  backgroundColor?: ColorValue | undefined;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) {
  return (
    <View style={styles.ListItemCnt}>
      <TouchableOpacity
        activeOpacity={props.activeOpacity ? props.activeOpacity : 0.8}
        disabled={props.isView || false}
        onPress={() => {
          props.onPress && props.onPress();
        }}
        style={{
          ...styles.ListItem,
          ...styles.shadowLow,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : 'white',
          ...props.innerStyle,
        }}>
        {props.children}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  ListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
  },
  ListItemCnt: {
    minHeight: 40,
    width: '100%',
    marginBottom: 10,
  },
  noShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
  shadowLow: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.05,
        shadowRadius: 30.0,
      },
      android: {
        elevation: 1,
      },
    }),
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
});
