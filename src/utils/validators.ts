export const isEmpty = (value: string | undefined) => !value || value === '';
export const isNumber = (value: any) => !isNaN(value);
export const isEmail = (value: string | undefined) => {
  if (!value || value === '') {
    return false;
  }
  var re = /\S+@\S+\.\S+/;
  return re.test(value);
};
