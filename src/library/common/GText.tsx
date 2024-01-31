import React, {FunctionComponent, PropsWithChildren} from 'react';
import {Text, TextProps} from 'react-native';

const GText: FunctionComponent<TextProps> = ({
  ...props
}: PropsWithChildren<TextProps>) => (
  <Text {...props} allowFontScaling={false}>
    {props.children}
  </Text>
);

export default GText;
