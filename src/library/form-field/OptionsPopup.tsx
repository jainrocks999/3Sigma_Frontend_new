/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import SectionedTextInput from './SectionedTextInput';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import Button from '../common/ButtonGroup';
import GModal from '../wrapper/GModal';
import BulkSelectionOptions from '../common/BulkSelectionOptions';
import {moderateScale} from 'resources/responsiveLayout';

interface OptionDataKeys {
  itemIdKey: string | number;
  itemTitleKey: string | number;
  itemDescriptionKey: string | number;
}
interface OptionsPopup {
  title?: string;
  buttonTitle?: string;
  showOptionPopup: boolean;
  dataKeys?: OptionDataKeys;
  options: Array<any>;
  selectedOptions?: Array<any> | Array<string> | string | number | null;
  multiSelectEnabled?: boolean;
  bulkSelectEnabled?: boolean;
  displayColor?: boolean;
  isSearchable?: boolean;
  contaienrStyle?: ViewStyle;
  onSelection: (selectedDataIndexes: Array<any> | any) => void;
  toggleOptionPopup: (showOptionPopup: boolean) => void;
  setMultiSelectEnabled?: (multiSelectEnabled: boolean) => void;
  onSearchTextChange?: (text: string) => void;
  onSubmitSearch?: (text: string) => void;
  onSelectAll?: (status: boolean) => void;
}
const OptionsPopup = ({
  title = 'Select',
  buttonTitle = 'OK',
  showOptionPopup,
  options,
  multiSelectEnabled,
  bulkSelectEnabled,
  onSearchTextChange,
  setMultiSelectEnabled,
  displayColor = false,
  toggleOptionPopup,
  onSelection,
  isSearchable = false,
  dataKeys = {
    itemIdKey: '_id',
    itemTitleKey: 'name',
    itemDescriptionKey: 'description',
  },
  onSubmitSearch,
  selectedOptions,
  contaienrStyle,
  onSelectAll,
}: OptionsPopup) => {
  const [selectedDataIndexes, setSelectedDataIndexes] = useState<Array<any>>(
    [],
  );
  useEffect(() => {
    if (selectedOptions) {
      if (multiSelectEnabled) {
        onSelection(selectedOptions);
        setSelectedDataIndexes(
          Array.isArray(selectedOptions) ? selectedOptions : [],
        );
      } else {
        const item = options.find(
          _i =>
            _i[dataKeys.itemIdKey] ===
            (Array.isArray(selectedOptions)
              ? selectedOptions[0]
              : selectedOptions),
        );
        if (item) {
          onSelection(item);
        }
      }
    } else {
      if (multiSelectEnabled) {
        setSelectedDataIndexes([]);
      } else {
      }
    }
    console.log('showOptionPopup', selectedOptions);
  }, [showOptionPopup]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectAll, setSelectAll] = useState<boolean>(false);
  // METHODS
  const handleDone = () => {
    onSelection(selectedDataIndexes);
    toggleOptionPopup(false);
  };
  function handleBulkSelection(type: string | number) {
    let indexes: Array<any> = [];
    if (typeof type === 'number') {
      indexes = [...selectedDataIndexes];
      const lastId = selectedDataIndexes
        ? selectedDataIndexes[selectedDataIndexes.length - 1]
        : null;
      const lastIndex = lastId
        ? options.findIndex(item => item[dataKeys.itemIdKey] === lastId) + 1
        : 0;
      for (let _i = lastIndex; _i < type + lastIndex; _i++) {
        const searchIndex = _i;
        if (
          searchIndex < options.length &&
          !selectedDataIndexes.includes(
            options[searchIndex][dataKeys.itemIdKey],
          )
        ) {
          indexes.push(options[searchIndex][dataKeys.itemIdKey]);
        }
      }
    } else if (type === 'unselect') {
      setSelectAll(false);
      onSelectAll && onSelectAll(false);
      indexes = [];
    } else if (type === 'all') {
      setSelectAll(true);
      onSelectAll && onSelectAll(true);
      indexes = options.map(_i => _i);
    }
    setSelectedDataIndexes(indexes);
  }
  const onItemPress = (item: any, selected: boolean) => {
    if (multiSelectEnabled) {
      const itemId = item[dataKeys.itemIdKey];
      const indexes = [...selectedDataIndexes];
      if (selected) {
        let _index: number = indexes.indexOf(itemId);
        if (_index !== -1) {
          indexes.splice(_index, 1);
        }
      } else {
        indexes.push(itemId);
      }
      setSelectedDataIndexes(indexes);
    } else {
      onSelection(item);
      toggleOptionPopup(false);
    }
  };
  return (
    <GModal
      isVisible={showOptionPopup}
      avoidKeyboard
      onModalHide={() => toggleOptionPopup(false)}>
      <View style={[styles.container, contaienrStyle]}>
        <View style={styles.listView}>
          <View>
            <Text style={styles.modalStyle}>{title}</Text>
            {isSearchable ? (
              <View style={styles.searchContainer}>
                <SectionedTextInput
                  placeholder={'Search'}
                  containerStyle={styles.inputStyle}
                  leftContent={
                    <Feather
                      name={'search'}
                      size={18}
                      color={R.colors.themeCol1}
                    />
                  }
                  defaultValue={searchText}
                  onChangeText={(toSearch: string) => {
                    setSearchText(toSearch);
                  }}
                  onSubmitEditing={() => {
                    onSearchTextChange && onSearchTextChange(searchText);
                    onSubmitSearch && onSubmitSearch(searchText);
                  }}
                />
              </View>
            ) : null}
            {multiSelectEnabled && bulkSelectEnabled ? (
              <BulkSelectionOptions
                handleBulkSelection={handleBulkSelection}
                selectedCounts={selectedDataIndexes.length || 0}
              />
            ) : null}
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.length ? (
              options.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.itemContainer}
                  onPress={() =>
                    onItemPress(
                      item,
                      selectedDataIndexes.includes(item[dataKeys.itemIdKey]),
                    )
                  }
                  delayLongPress={1000}
                  onLongPress={() => {
                    setMultiSelectEnabled && setMultiSelectEnabled(true);
                  }}>
                  <View style={styles.itemTitle}>
                    {displayColor ? (
                      <View
                        style={[
                          styles.colorCircle,
                          {backgroundColor: item.color || 'black'},
                        ]}
                      />
                    ) : null}

                    <View style={{flexDirection: 'column', flex: 1}}>
                      <Text style={styles.labelText} numberOfLines={2}>
                        {item[dataKeys.itemTitleKey]}
                      </Text>
                      {item[dataKeys.itemDescriptionKey] && (
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={3}
                          style={styles.descriptionText}>
                          {item[dataKeys.itemDescriptionKey]}
                        </Text>
                      )}
                    </View>
                  </View>

                  {multiSelectEnabled && (
                    <MaterialCommunityIcons
                      name={
                        selectedDataIndexes.includes(
                          item[dataKeys.itemIdKey],
                        ) || selectAll
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      color={R.colors.themeCol2}
                      size={25}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.blankMessage}>0 Options available</Text>
              </View>
            )}
            {/* <GFlatList
              showsVerticalScrollIndicator={false}
              // style={{height: '100%'}}
              data={options}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.blankMessage}>0 Options available</Text>
                  </View>
                );
              }}
              renderItem={({item, index}) => {}}
              removeClippedSubviews={true}
              initialNumToRender={15}
              maxToRenderPerBatch={2}
              updateCellsBatchingPeriod={100}
              emptyMessage={'No Data found'}
            /> */}
          </ScrollView>
          {multiSelectEnabled && options?.length > 0 && (
            <View style={styles.btnContainer}>
              <Button
                buttonStyle={styles.buttonStyle}
                label={buttonTitle}
                onPress={handleDone}
                labelStyle={{paddingVertical: 10}}
              />
            </View>
          )}
        </View>
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  searchContainer: {},
  container: {
    width: '100%',
    backgroundColor: R.colors.bgCol,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
    minHeight: '40%',
    maxHeight: '90%',
  },
  bulkMessage: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
  modalStyle: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.BOLD),
    color: R.colors.themeCol1,
    paddingTop: 15,
    marginBottom: 15,
  },
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
  buttonStyle: {
    width: '100%',
    backgroundColor: R.colors.themeCol2,
  },
  btnContainer: {
    width: '100%',
    marginTop: 20,
  },
  descriptionText: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
    textTransform: 'capitalize',
  },
  blankMessage: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.REGULAR),
    color: R.colors.labelCol1,
  },
  labelText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    color: R.colors.black,
  },
  colorCircle: {
    backgroundColor: 'black',
    height: 20,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  itemContainer: {
    width: '100%',
    paddingVertical: 15,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {flex: 1, flexDirection: 'row'},
  emptyContainer: {alignItems: 'center', justifyContent: 'center'},
  listView: {maxHeight: '100%'},
  listViewSmall: {},
  inputStyle: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    height: 50,
  },
});

export default OptionsPopup;
