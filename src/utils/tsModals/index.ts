import {ReactElement} from 'react';
import {StyleSheetProperties} from 'react-native';

export type LeadListItem = {
  item: any;
  index: number;
  section: any;
};
export interface HorizontalListProps {
  options?: any;
  type?: string;
  onChangeVal?: () => void;
  onChangeDateOptions?: () => void;
}

export interface DefaultTextInputProps {
  multiline?: boolean;
  containerStyle?: StyleSheetProperties;
  style?: StyleSheetProperties;
  characterCount?: number;
  showCharacterCount?: boolean;
}
export interface SectionTextInputProps {
  leftContent?: ReactElement;
  containerStyle?: StyleSheetProperties;
  leftWidth?: string;
  rightWidth?: string;
  rightContent?: ReactElement;
  editable?: boolean;
  placeholderColor?: string;
  placeholder?: string;
  keyboardType?: string;
}
export interface ConfirmationDialogProps {
  showDialog: boolean;
  onConfirm: (status: boolean) => void;
  confirmationMessage: string;
}
