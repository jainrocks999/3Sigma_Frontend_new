import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.titleHeaderWrapperQuotation}>
        {/* <HeadTitle screenTitle={'Quotation'} onClickMenu={onClickMenu}/> */}
        <View style={{height: 200, backgroundColor: 'gray'}}>
          <Text>{'Arun Gupta'}</Text>
        </View>
      </View>
    </View>
  );
}
