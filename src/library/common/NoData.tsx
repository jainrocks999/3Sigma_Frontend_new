import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GAlert from './GAlert';

// CONSTANTS

const UploadProgress = props => {
  const openYoutube = (link: string) => {
    Linking.canOpenURL(link)
      .then(supported => {
        if (!supported) {
          GAlert('Unable to open app');
        } else {
          Linking.openURL(link);
        }
      })
      .catch(_err => {
        GAlert('Unable to open app');
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headerText}>{props.heading}</Text>
      </View>
      <View style={styles.subHeading}>
        <Text style={styles.subHeadingText}>{props.subheading}</Text>
        {props.heading == 'Add your first lead' && (
          <TouchableOpacity
            style={{margin: 10}}
            onPress={() => {
              openYoutube('https://youtu.be/LgXODxtvD7M');
            }}>
            <FontAwesome
              name={'youtube-play'}
              size={40}
              color={R.colors.IndianRed}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: R.colors.bgCol,
    paddingVertical: 100,
  },
  heading: {display: 'flex', width: '100%'},
  headerText: {
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.BOLD),
    textAlign: 'center',
    color: R.colors.textCol2,
  },
  subHeading: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subHeadingText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    flexWrap: 'wrap',
    color: R.colors.textCol2,
    lineHeight: 20,
  },
});
export default UploadProgress;
