export interface InputTextProps {
  boxHeight?: number | null;
  multiLine?: boolean | null;
  readOnly?: boolean | null;
  numberOfLines?: number | null;
  placeHolder?: string | null;
  value?: string | null;
  onChangeText?: any | null;
  tag?: Array<string> | null;
  textWidth?: number | null;
  icon?: any | null;
}

export interface TagProps {
  text?: string | null;
  color?: string | null;
  onPress?: any | null;
  addActive: boolean | null;
  newAddedTag: string | null;
}
