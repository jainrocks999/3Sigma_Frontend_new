import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';

interface BulkSelectionOptionsProps {
  handleBulkSelection: (type: number | string) => void;
  selectedCounts: number;
}
const BulkSelectionOptions = ({
  handleBulkSelection,
  selectedCounts = 0,
}: BulkSelectionOptionsProps) => {
  return (
    <View style={styles.searchInputConainer}>
      <Text style={styles.bulkMessage}>
        Bulk select (Selected leads : {selectedCounts || 0})
      </Text>
      <View style={styles.searchBox}>
        <TouchableOpacity
          onPress={() => handleBulkSelection(26)}
          style={styles.flexOne}>
          <Text numberOfLines={1} style={styles.searchOption}>
            Next 25
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleBulkSelection(51)}
          style={styles.middleOption}>
          <Text numberOfLines={1} style={styles.searchOption}>
            Next 50
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => handleBulkSelection('all')}
          style={styles.flexOne}>
          <Text numberOfLines={1} style={styles.searchOption}>
            Select All
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => handleBulkSelection('unselect')}
          style={styles.unselectedOption}>
          <Text numberOfLines={1} style={styles.searchOption}>
            Un-Select
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchInputConainer: {marginBottom: 10},
  middleOption: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: R.colors.themeCol2,
  },
  unselectedOption: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: R.colors.themeCol2,
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  flexOne: {flex: 1},
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: R.colors.themeCol2,
    alignItems: 'center',
  },
  searchOption: {
    paddingVertical: 10,
    textAlign: 'center',
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.black,
  },
  bulkMessage: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
});
export default BulkSelectionOptions;
