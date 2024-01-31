import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {moderateScale} from 'resources/responsiveLayout';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MultiOptionModal = props => {
  let {display, onModalClose, data} = props;
  const [selectedCheckBox, setSelectedCheckBox] = useState(data);

  const updateArrayValue = (val: string) => {
    const newState = selectedCheckBox?.map(
      (obj: {value: any; isDefault: boolean}) => {
        if (obj.value === val) {
          return {...obj, isDefault: !obj.isDefault};
        }
        return obj;
      },
    );
    setSelectedCheckBox([...newState]);
  };

  const handleButtonPress = () => {
    props.onItemSelect &&
      props.onItemSelect(
        selectedCheckBox
          .filter(function (item) {
            return item.isDefault === true;
          })
          .map(function ({value}) {
            return value;
          }),
      );
  };
  const renderItem = ({item, index, section}) => {
    return (
      <TouchableOpacity onPress={() => updateArrayValue(item?.value)}>
        <View style={styles.rowWrapper}>
          <View style={styles.dotWrapper}>
            {item?.color && (
              <View
                style={[
                  styles.colorIndicator,
                  {backgroundColor: item?.color || R.colors.pinkColor},
                ]}
              />
            )}
            <Text style={styles.itemText}>{item?.name}</Text>
          </View>
          <View style={styles.checkBoxStyle}>
            <MaterialCommunityIcons
              name={
                item.isDefault ? 'checkbox-marked' : 'checkbox-blank-outline'
              }
              color={R.colors.themeCol2}
              size={25}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <GModal
      isVisible={display}
      onModalHide={() => {
        onModalClose();
      }}>
      <View style={styles.modalView}>
        <View style={styles.scrollStyle}>
          <FlatList
            data={selectedCheckBox}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleButtonPress}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </GModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: R.colors.transparentBlack,
  },
  modalView: {
    width: '100%',
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    padding: moderateScale(10),
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
  },
  closeButton: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: R.colors.stroke2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(8),
    marginRight: moderateScale(10),
  },
  scrollStyle: {
    width: '100%',
  },
  rowWrapper: {
    borderBottomColor: R.colors.disabledGrey,
    borderBottomWidth: 1,
    paddingVertical: moderateScale(15),
    width: '100%',
    paddingLeft: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
  },
  colorIndicator: {
    height: moderateScale(10),
    width: moderateScale(10),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(8),
  },
  itemText: {
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: R.colors.themeCol1,
  },
  saveButton: {
    width: '90%',
    height: moderateScale(50),
    backgroundColor: R.colors.themeCol2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
    marginTop: 20,
  },
  saveText: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.MEDIUM),
    color: R.colors.white,
  },
  checkBoxStyle: {
    alignSelf: 'flex-end',
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MultiOptionModal;
