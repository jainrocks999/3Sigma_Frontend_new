import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import GModal from '../wrapper/GModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GFlatList from './GFlatList';
interface ListItem {
  name?: string | number;
  value?: string | number;
  icon?: string | number;
}
interface ListModalProps {
  display: boolean;
  onModalClose: () => void;
  onItemSelect: (item: string) => void;
  data: Array<ListItem | string | number>;
  title?: string | null;
  emptyMessage?: string | null;
}
const ListModal = (props: ListModalProps) => {
  let {display, onModalClose, data, onItemSelect, title, emptyMessage} = props;

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={styles.rowWrapper}
        key={index}
        onPress={() => onItemSelect(item?.value)}>
        {item.icon ? (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={item.icon}
              color={item?.iconcolor || 'black'}
              size={22}
            />
          </View>
        ) : null}
        {item?.color && (
          <View
            style={[
              styles.colorIndicator,
              {backgroundColor: item?.color || R.colors.pinkColor},
            ]}
          />
        )}
        <Text style={styles.itemText}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <GModal isVisible={display} onModalHide={onModalClose}>
      <View style={styles.modalView}>
        <View style={styles.headerWrapper}>
          <Text style={styles.popupHeader}>{title}</Text>
        </View>
        <View style={styles.scrollStyle}>
          <GFlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?.value || Math.random()}
            emptyMessage={emptyMessage || ''}
          />
        </View>
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  modalView: {
    maxHeight: '80%',
    width: '100%',
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
    backgroundColor: R.colors.bgCol,
    minHeight: '20%',
  },

  scrollStyle: {
    width: '100%',
  },
  rowWrapper: {
    borderBottomColor: R.colors.disabledGrey,
    paddingVertical: moderateScale(10),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(8),
  },
  itemText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  popupHeader: {
    ...R.generateFontStyle(FontSizeEnum.LG, FontWeightEnum.SEMI_BOLD),
    color: R.colors.themeCol1,
  },
  iconContainer: {
    height: 40,
    width: 40,
    padding: 5,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: R.colors.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListModal;
