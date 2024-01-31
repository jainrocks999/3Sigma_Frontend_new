import {Nillable} from '../models/custom.types';

const commonUtil: any = {
  // TODO: Check the typescript reference later to avoid runtime failures
  workaroundFocus: (textInputRef: any) => {
    textInputRef.current && textInputRef.current.blur();
    setTimeout(() => textInputRef.current?.focus(), 0);
  },

  getEnumKeyByEnumValue: <T extends {[index: string]: number | string}>(
    enumT: T,
    enumValue: number | string,
  ): keyof T | null => {
    const keys = Object.keys(enumT).filter(x => enumT[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  },

  getInitials: (name: string) => {
    const names = name.split(/\s/);
    if (names && names.length > 0 && names[0].length > 0) {
      let initials = names[0][0].toUpperCase();
      if (names.length > 1 && names[names.length - 1].length > 0) {
        const lastNameInitial = names[names.length - 1][0].toUpperCase();
        initials = `${initials}${lastNameInitial}`;
      }
      return initials;
    }
    return '';
  },

  getRandomAlphaNumeric: () => Math.random().toString(36).slice(2),

  notEmpty<TValue>(value: Nillable<TValue>): value is TValue {
    return value !== null && value !== undefined;
  },
};

export default commonUtil;
