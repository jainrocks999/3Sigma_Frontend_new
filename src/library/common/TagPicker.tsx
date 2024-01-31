/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GAlert from 'library/common/GAlert';
import {Button} from './ButtonGroup';
import {useDispatch, useSelector} from 'react-redux';
import {RootDispatch, RootState} from '../../store/app.store';
import {
  selectPrefrence,
  updateUserPrefrence,
} from '../../store/slices/user.slice';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';
import {ScrollView} from 'react-native-gesture-handler';
interface TagPickerProps {
  selectedTags: Array<string>;
  tagLabel: string;
  firstSelected?: boolean;
  showScrolView?: boolean;
  defaultTags?: Array<{name: string; value: string}>;
  singleSelect?: boolean;
  onTagSelect: (value: string) => void;
  tagKey: PrefrenceKeyEnum;
  tagContainer?: ViewStyle;
}
const TagPicker = ({
  selectedTags,
  firstSelected = true,
  tagLabel,
  defaultTags = [],
  onTagSelect,
  tagKey,
  tagContainer = {},
  showScrolView = true,
}: TagPickerProps) => {
  const dispatch = useDispatch<RootDispatch>();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState<string>('');
  const tags: Array<any> = useSelector((state: RootState) =>
    selectPrefrence(state, tagKey),
  );
  useEffect(() => {
    if (tags && tags.length === 1 && firstSelected) {
      onTagSelect(tags[0].value);
    }
  }, []);
  const handeAddNewtag = async (_newTag: {name: string; value: string}) => {
    const response = await dispatch(
      updateUserPrefrence({
        key: tagKey,
        value: [...(tags && tags.length ? tags : defaultTags), _newTag],
      }),
    );
    if (response.meta.requestStatus === 'fulfilled') {
      onTagSelect(_newTag.value);
    } else {
      GAlert('Error while adding tag');
    }
  };
  return showScrolView ? (
    <ScrollView
      horizontal={true}
      style={[styles.tagContainer, tagContainer]}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}>
      <View style={{flexDirection: 'row'}}>
        {!isAddingTag && (
          <Button
            buttonStyle={{
              ...styles.s2TagsCnt,
              borderWidth: 0.7,
              borderColor: R.colors.themeCol2,
              backgroundColor: 'transparent',
              width: 'auto',
              justifyContent: 'center',
              height: 40,
            }}
            labelStyle={{
              ...styles.s2BtnLabel,
            }}
            label={tagLabel}
            onPress={() => setIsAddingTag(true)}
          />
        )}
        {isAddingTag && (
          <View
            style={{
              ...styles.s2TagsCnt,
              ...styles.totalCenter,
              paddingHorizontal: 5,
              borderWidth: 0.7,
              borderColor: R.colors.themeCol2,
              flexDirection: 'row',
              height: 40,
            }}>
            <TextInput
              style={{
                minWidth: 50,
                ...R.generateFontStyle(
                  FontSizeEnum.BASE,
                  FontWeightEnum.SEMI_BOLD,
                ),
                color: R.colors.themeCol1,
                paddingVertical: 5,
              }}
              placeholderTextColor={'#999999'}
              maxLength={25}
              autoFocus
              onChangeText={(_newTag: any) => setNewTag(_newTag)}
            />
            <TouchableOpacity
              style={{
                ...styles.totalCenter,
                width: 22,
                aspectRatio: 1,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: 'green',
                marginLeft: 10,
              }}
              onPress={() => {
                if (newTag.length) {
                  const tagValue = newTag
                    .trim()
                    .toLocaleLowerCase()
                    .split(' ')
                    .join('_');

                  if (
                    (tags && tags.length ? tags : defaultTags).filter(
                      _v => _v.value === tagValue,
                    ).length === 1
                  ) {
                    GAlert('Cannot add duplicate tag');
                  } else {
                    handeAddNewtag({
                      name: newTag,
                      value: tagValue,
                    });
                  }
                }
                setNewTag('');
                setIsAddingTag(false);
              }}>
              <MaterialCommunityIcons
                name={'check'}
                size={15}
                color={'green'}
              />
            </TouchableOpacity>
            <View
              style={{
                height: 25,
                width: 1,
                backgroundColor: 'lightgrey',
                marginHorizontal: 5,
              }}
            />
            <TouchableOpacity
              style={{
                ...styles.totalCenter,
                width: 22,
                aspectRatio: 1,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: R.colors.IndianRed,
              }}
              onPress={() => setIsAddingTag(false)}>
              <MaterialCommunityIcons
                name={'close'}
                size={15}
                color={R.colors.IndianRed}
              />
            </TouchableOpacity>
          </View>
        )}
        {(tags && tags.length ? tags : defaultTags).map(
          (item: any, index: number) => {
            return (
              <Button
                key={index.toString()}
                buttonStyle={{
                  ...styles.s2TagsCnt,
                  backgroundColor:
                    selectedTags.indexOf(item.value) !== -1
                      ? R.colors.themeCol2
                      : '#dde3e9',
                  width: 'auto',
                  justifyContent: 'center',
                  height: 40,
                }}
                labelStyle={{
                  ...styles.s2BtnLabel,
                  color:
                    selectedTags.indexOf(item.value) !== -1
                      ? 'white'
                      : R.colors.labelCol1,
                }}
                label={item.name}
                onPress={() => onTagSelect(item.value)}
              />
            );
          },
        )}
      </View>
    </ScrollView>
  ) : (
    <View style={{flexWrap: 'wrap', flexDirection: 'row', width: '100%'}}>
      {(tags && tags.length ? tags : defaultTags).map(
        (item: any, index: number) => {
          return (
            <Button
              key={index.toString()}
              buttonStyle={{
                ...styles.s2TagsCnt,
                backgroundColor:
                  selectedTags.indexOf(item.value) !== -1
                    ? R.colors.themeCol2
                    : '#dde3e9',
                width: 'auto',
                justifyContent: 'center',
                height: 40,
                paddingHorizontal: 10,
              }}
              labelStyle={{
                ...styles.s2BtnLabel,
                color:
                  selectedTags.indexOf(item.value) !== -1
                    ? 'white'
                    : R.colors.labelCol1,
              }}
              label={item.name}
              onPress={() => onTagSelect(item.value)}
            />
          );
        },
      )}
      {!isAddingTag && (
        <Button
          buttonStyle={{
            ...styles.s2TagsCnt,
            borderWidth: 0.7,
            borderColor: R.colors.themeCol2,
            backgroundColor: 'transparent',
            width: 'auto',
            justifyContent: 'center',
            height: 40,
          }}
          labelStyle={{
            ...styles.s2BtnLabel,
          }}
          label={tagLabel}
          onPress={() => setIsAddingTag(true)}
        />
      )}
      {isAddingTag && (
        <View
          style={{
            ...styles.s2TagsCnt,
            ...styles.totalCenter,
            paddingHorizontal: 5,
            borderWidth: 0.7,
            borderColor: R.colors.themeCol2,
            flexDirection: 'row',
            height: 40,
          }}>
          <TextInput
            style={{
              minWidth: 50,
              ...R.generateFontStyle(
                FontSizeEnum.BASE,
                FontWeightEnum.SEMI_BOLD,
              ),
              color: R.colors.themeCol1,
              paddingVertical: 5,
            }}
            placeholderTextColor={'#999999'}
            maxLength={25}
            autoFocus
            onChangeText={(_newTag: any) => setNewTag(_newTag)}
          />
          <TouchableOpacity
            style={{
              ...styles.totalCenter,
              width: 22,
              aspectRatio: 1,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: 'green',
              marginLeft: 10,
            }}
            onPress={() => {
              if (newTag.length) {
                const tagValue = newTag
                  .trim()
                  .toLocaleLowerCase()
                  .split(' ')
                  .join('_');

                if (
                  (tags && tags.length ? tags : defaultTags).filter(
                    _v => _v.value === tagValue,
                  ).length === 1
                ) {
                  GAlert('Cannot add duplicate tag');
                } else {
                  handeAddNewtag({
                    name: newTag,
                    value: tagValue,
                  });
                }
              }
              setNewTag('');
              setIsAddingTag(false);
            }}>
            <MaterialCommunityIcons name={'check'} size={15} color={'green'} />
          </TouchableOpacity>
          <View
            style={{
              height: 25,
              width: 1,
              backgroundColor: 'lightgrey',
              marginHorizontal: 5,
            }}
          />
          <TouchableOpacity
            style={{
              ...styles.totalCenter,
              width: 22,
              aspectRatio: 1,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: R.colors.IndianRed,
            }}
            onPress={() => setIsAddingTag(false)}>
            <MaterialCommunityIcons
              name={'close'}
              size={15}
              color={R.colors.IndianRed}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TagPicker;
export const styles = StyleSheet.create({
  s2TagsCnt: {
    borderRadius: 10,
    marginTop: 10 / 2,
    marginRight: 20 / 2,
  },
  tagContainer: {
    marginBottom: 20,
  },
  s2BtnLabel: {
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.BOLD),
    color: R.colors.themeCol2,
  },
  labelStyle: {
    color: R.colors.labelCol1,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    marginTop: 20,
  },
  totalCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputStyle: {
    minWidth: 50,
    ...R.generateFontStyle(FontSizeEnum.SM, FontWeightEnum.MEDIUM),
    color: '#000',
  },
});
