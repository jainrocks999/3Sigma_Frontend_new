import React, {FunctionComponent, PropsWithChildren} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';
import {ImageLocation, ImageSize} from '../../models/consts/imageSize.enum';
import {getImageURL} from '../../utils/image.util';
import {Nillable} from '../../models/custom.types';
import {currentUserSelector} from '../../store/slices/user.slice';
import {useSelector} from 'react-redux';
import {User} from 'datalib/entity/user';
import {S3_URL} from '../../../env';
import {EnvironmentEnum} from '../../models/consts/environment.enum';
const placeholder = require('../../resources/images/placeholder.png');
interface ImageProps {
  style?: object;
  imageName: string;
  uri?: boolean;
  size?: ImageSize;
  location?: ImageLocation;
}

const GImage: FunctionComponent<ImageProps> = ({
  style,
  uri,
  imageName,
  size = ImageSize.ORIGINAL,
  location = ImageLocation.USER,
}: PropsWithChildren<ImageProps>) => {
  const user: Nillable<User> = useSelector(currentUserSelector);
  const bucketUrl = user?.bucketUrl
    ? user.bucketUrl
    : S3_URL[EnvironmentEnum.DEVELOPMENT];
  return (
    <ImageBackground style={styles.imageStyle} source={placeholder}>
      <FastImage
        style={[style ? style : {}, styles.imageStyle]}
        source={
          imageName && imageName !== ''
            ? {uri: uri ? imageName : getImageURL(imageName, bucketUrl)}
            : placeholder
        }
        resizeMode={FastImage.resizeMode.contain}
      />
    </ImageBackground>
  );
};

export default GImage;
const styles = StyleSheet.create({
  imageStyle: {},
});
