import {Nullable} from '../models/custom.types';

export const MOBILE_LENGTH = 10;
export const COUNTRY_CODE_IND = '+91';

export const isValidMobileFormat = (mobileNumber: string): boolean =>
  !!mobileNumber && !mobileNumber.startsWith('0');

// Only for indian numbers
export const isValidMobile = (mobileNumber: string): boolean =>
  isValidMobileFormat(mobileNumber) && mobileNumber.length === MOBILE_LENGTH;

// TODO: Explore international phone number format in future
export const convertToIndiaFormat: (
  mobileNumber: NonNullable<string>,
) => Nullable<string> = (mobileNumber: NonNullable<string>) => {
  const trimmedMobileNumber = mobileNumber?.replace(/\s/g, '');
  if (trimmedMobileNumber.startsWith('+')) {
    if (
      trimmedMobileNumber.startsWith(COUNTRY_CODE_IND) &&
      trimmedMobileNumber.replace(COUNTRY_CODE_IND, '').length === MOBILE_LENGTH
    ) {
      return trimmedMobileNumber;
    }
  } else if (trimmedMobileNumber.startsWith('0')) {
    // TODO: 0091 is not supported as indian number, do we need to support this?
    const rawMobileNumber = trimmedMobileNumber.replace('0', '');
    if (
      rawMobileNumber.length === MOBILE_LENGTH &&
      !rawMobileNumber.startsWith('0')
    ) {
      return `${COUNTRY_CODE_IND}${rawMobileNumber}`;
    }
  } else if (trimmedMobileNumber.length === MOBILE_LENGTH) {
    return `${COUNTRY_CODE_IND}${trimmedMobileNumber}`;
  }
  return null;
};
