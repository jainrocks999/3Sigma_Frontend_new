import {StyleSheet, Text} from 'react-native';
import React from 'react';

import {useSelector} from 'react-redux';
import {selectPrefrence} from '../../store/slices/user.slice';
import {RootState} from '../../store/app.store';
import R from 'resources/R';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import {moderateScale} from 'resources/responsiveLayout';
import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';

interface TagProps {
  tags: Array<any>;
  tagKey: PrefrenceKeyEnum;
}
const Tag = ({tags, tagKey}: TagProps) => {
  const tagList = useSelector((state: RootState) =>
    selectPrefrence(state, tagKey),
  );
  const getTagName = (_tag: string) => {
    const tag = tagList.find((_i: any) => _i.value === _tag);
    return tag ? tag.name : _tag;
  };
  const getTag = (_tag: string, _key: string) => {
    const tag = tagList.find((_i: any) => _i.value === _tag);
    return tag ? tag.color : R.colors.themeCol2;
  };
  return (
    <>
      {tags && tags.length && tagKey
        ? tags.map(
            (_item, index) =>
              index < 5 && (
                <Text
                  key={index}
                  numberOfLines={1}
                  style={[
                    styles.messageTag,
                    {
                      backgroundColor:
                        getTag(_item, 'color') || R.colors.themeCol2,
                    },
                  ]}>
                  {getTagName(_item).split('_').join(' ')}{' '}
                  {Array.isArray(tags) && tags?.length > 5 && index === 4
                    ? `+${tags.length - 5} others`
                    : null}
                </Text>
              ),
          )
        : null}
    </>
  );
};

export default Tag;
const styles = StyleSheet.create({
  messageTag: {
    ...R.generateFontStyle(FontSizeEnum.XS, FontWeightEnum.SEMI_BOLD),
    color: R.colors.white,
    marginVertical: moderateScale(3),
    marginRight: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(8),
    textTransform: 'capitalize',
  },
});
