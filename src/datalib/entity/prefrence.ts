import {PrefrenceKeyEnum} from '../../models/common/preference.keys.enum';

export interface PrefrenceObject {
  _id: string;
  [PrefrenceKeyEnum.ACTIVITY_NOTIFICATION_FLAG]: boolean;
  [PrefrenceKeyEnum.LEAD_DUPLICATE_FLAG]: boolean;
  [PrefrenceKeyEnum.NEWLEAD_NOTIFICATION_FLAG]: boolean;
  [PrefrenceKeyEnum.RECENT_NOTIFICATION_FLAG]: boolean;
  [PrefrenceKeyEnum.ACTIVITY_TYPE]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.LEAD_FORM]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.LEAD_CUSTOM_SOURCES]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.FILE_TAG]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.LABELS]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.MESSAGE_TAG]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.PAGE_TAG]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.STATUS]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.TASK_TYPE]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.TAX_OPTIONS]: Array<PrefrenceItem>;
  [PrefrenceKeyEnum.COUNTRY_DETAIL]: object;
  [PrefrenceKeyEnum.PERMISSIONS]: Array<any>;
  [PrefrenceKeyEnum.SCREEN_PERMISSION]: Array<string>;
}
export interface PrefrenceItem {
  name?: string;
  value: string;
  placeholder?: string;
  isRequired?: boolean;
  type: string;
  label?: string;
  multiLine?: boolean;
  displayColor?: boolean;
  numberOfLines?: number;
  read_only?: boolean;
  disable?: boolean;
  default_value?: any;
  options?: Array<any>;
  suggestion?: Array<any>;
  modalTitle?: string;
}
