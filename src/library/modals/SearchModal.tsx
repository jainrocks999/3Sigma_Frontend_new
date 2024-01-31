import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import GModal from 'library/wrapper/GModal';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {Nillable} from '../../models/custom.types';

const SearchModal = ({
  isVisible,
  onSearch,
  onModalClose,
  defaultText,
  onTagSelect,
  searchTags,
  selectedTag = null,
}: {
  isVisible: boolean;
  defaultText: string;
  onModalClose: (isVisible: boolean) => void;
  onSearch: (search: string) => void;
  onTagSelect: (search: string) => void;
  searchTags: Array<any>;
  selectedTag: Nillable<string>;
}) => {
  let searchBar: MutableRefObject<null> = useRef(null);
  const [searchValueText, setSearchValueText] = useState(defaultText || '');

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => searchBar.current.focus(), 600);
    }
  }, [isVisible]);
  return (
    <GModal
      isVisible={isVisible}
      position={'top'}
      animationIn="slideInDown"
      animationOut={'slideOutUp'}
      onModalHide={() => onModalClose(false)}>
      <View style={styles.animatedsearch}>
        <View style={styles.searchContainer}>
          <Feather name={'search'} size={25} color={R.colors.themeCol1} />
          {isVisible && (
            <TextInput
              ref={searchBar}
              onBlur={() => {
                onModalClose(false);
              }}
              placeholder={'Search'}
              placeholderTextColor={'#999999'}
              style={styles.searchTextInput}
              value={searchValueText}
              onChangeText={text => {
                setSearchValueText(text);
              }}
              onSubmitEditing={() => onSearch(searchValueText)}
            />
          )}
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => {
              setSearchValueText('');
            }}>
            <MaterialCommunityIcons
              name={'close-circle'}
              size={25}
              color={R.colors.themeCol1}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tagContainer}>
          {searchTags
            ? searchTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onTagSelect(tag.value)}
                  style={styles.searchItem}>
                  <View
                    style={
                      tag.value === selectedTag
                        ? styles.activeFilterBtn
                        : styles.filterBtn
                    }>
                    <View>
                      <MaterialCommunityIcons
                        name={'account-circle-outline'}
                        size={20}
                        color={tag.value === selectedTag ? 'white' : 'black'}
                      />
                    </View>
                    <Text
                      style={
                        tag.value === selectedTag
                          ? styles.activeBtnText
                          : styles.filterBtnText
                      }>
                      {tag.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </View>
      </View>
    </GModal>
  );
};

export default SearchModal;
const styles = StyleSheet.create({
  searchTextInput: {
    height: '100%',
    width: '85%',
    color: 'black',
    marginLeft: 10,
    paddingRight: 10,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
  },
  animatedsearch: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 999,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomColor: R.colors.InputGrey3,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  filterBtnText: {
    color: 'black',
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginLeft: 5,
  },
  activeBtnText: {
    color: 'white',
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginLeft: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  filterBtn: {
    borderRadius: 15,
    backgroundColor: R.colors.stroke2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchItem: {marginRight: 10},
  activeFilterBtn: {
    borderRadius: 15,
    backgroundColor: R.colors.themeCol2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});
