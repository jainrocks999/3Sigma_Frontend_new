/* eslint-disable radix */
import {Animated, Easing, Linking, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import {Lead} from 'datalib/entity/lead';
import {functions, isNil} from 'lodash';
import GAlert from 'library/common/GAlert';
import {FormField} from 'library/form-field/DynamicForm';
import {uploadFile} from '../store/slices/lead.slice';
import {RootDispatch} from '../store/app.store';
import {FileRelationEnum} from 'library/common/UploadImage';

const pad = (data: string | number) => {
  if (parseInt(data, 10) < 10) return '0' + data;
  return data;
};

const Helper = {
  sortArrayAlphabetically: (data: any, columnName: string) => {
    const regex = /^[a-zA-Z]+$/;
    const dummyArray1 = [];
    const dummyArray2 = [];
    for (var i = 0; i < data.length; i++) {
      try {
        if (regex.test(data[i][columnName].charAt(0))) {
          dummyArray1.push(data[i]);
        } else {
          dummyArray2.push(data[i]);
        }
      } catch (error) {
        dummyArray2.push(data[i]);
      }
    }
    const withoutSpecialChar = dummyArray1.sort((a, b) =>
      a[columnName].localeCompare(b[columnName]),
    );
    const withSpecialChar = dummyArray2.sort((a, b) =>
      (a.displayName || '').localeCompare(b.displayName),
    );
    return withoutSpecialChar.concat(withSpecialChar);
  },
  getExtension: (fileName: string) =>
    fileName.substr(fileName.lastIndexOf('.') + 1),
  handleFileUpload: async (
    dispatch: RootDispatch,
    selectedFiles: Array<any>,
    relation: FileRelationEnum,
    relationId: string,
  ) => {
    if (selectedFiles && selectedFiles.length) {
      const formData = new FormData();
      formData.append('type', relation);

      formData.append(relation, relationId);
      selectedFiles.forEach((file: any) => {
        formData.append('files', {
          ...file,
          uri:
            Platform.OS === 'android'
              ? file.uri
              : file.uri.replace('file://', ''),
        });
      });
      return await dispatch(uploadFile(formData));
    } else {
      return null;
    }
  },
  isFormValid: (fieldArray: Array<FormField>, values: any) => {
    let valid = true;
    fieldArray.map((field: any) => {
      if (
        !field.readOnly &&
        !field.disable &&
        field.isRequired &&
        (values[field.value] === '' || isNil(values[field.value]))
      ) {
        if (valid) {
          GAlert(`${field.label} cannot be empty`);
        }
        valid = false;
      }
    });
    return valid;
  },
  startAnimation: (
    toAnimate: any,
    toValue: number,
    cb = () => {},
    duration = 100,
    easing = Easing.linear,
  ) => {
    Animated.timing(toAnimate, {
      toValue: toValue,
      duration: duration,
      easing: easing,
      useNativeDriver: false,
    }).start(cb);
  },
  splitName: (fillName: string) => {
    let name = fillName.split(' ');
    const firstName = name[0];
    let lastName = '';
    name.splice(0, 1);
    if (name.length) {
      lastName = name.join(' ');
    }
    return {
      firstName,
      lastName,
    };
  },
  validateEmail: (email: string) => {
    return (
      email &&
      email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    );
  },
  formatDataDateWise: (leads: any[]) => {
    var data: any = [];
    var sections: Array<string> = [];
    if (leads.length) {
      leads.map((item: Lead) => {
        let day = '';

        if (item) {
          if (moment(item.createdAt).format('L') === moment().format('L')) {
            day = 'Today';
          } else if (
            moment().subtract(1, 'days').format('L') ==
            moment(item.createdAt).format('L')
          ) {
            day = 'Yesterday';
          } else {
            day = moment(item.createdAt).format('LL');
          }

          if (sections.includes(day)) {
            data[sections.indexOf(day)].data.push(item._id);
          } else {
            sections.push(day);
            data[sections.indexOf(day)] = {title: day, data: [item._id]};
          }
        }
      });
    }

    return data;
  },
  formatDataSectionWise: (leads: any[], key: string = 'startedAt') => {
    var data: any = [];
    var sections: Array<string> = [];
    if (leads.length) {
      leads.map((item: Lead) => {
        let day = '';

        if (item) {
          if (moment(item[key]).format('L') === moment().format('L')) {
            day = 'Today';
          } else if (
            moment().subtract(1, 'days').format('L') ==
            moment(item[key]).format('L')
          ) {
            day = 'Yesterday';
          } else {
            day = moment(item[key]).format('LL');
          }

          if (sections.includes(day)) {
            data[sections.indexOf(day)].data.push(item._id);
          } else {
            sections.push(day);
            data[sections.indexOf(day)] = {title: day, data: [item._id]};
          }
        }
      });
    }

    return data;
  },
  validatePhone: (phone: string) => {
    if (phone) {
      return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(phone);
    } else {
      return false;
    }
  },
  isValidDate: (date: any) => {
    return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
  },
  isValidURL: (string: string) => {
    var res =
      string &&
      string.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      );
    return res !== null;
  },
  splitPhone: (phone: any) => {
    return phone;
  },
  kFormatter: (num: number, digits = 2) => {
    var si = [
      {value: 1, symbol: ''},
      {value: 1e3, symbol: 'k'},
      {value: 1e6, symbol: 'M'},
      {value: 1e9, symbol: 'G'},
      {value: 1e12, symbol: 'T'},
      {value: 1e15, symbol: 'P'},
      {value: 1e18, symbol: 'E'},
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    // const lookup = [
    //   {value: 1, symbol: ''},
    //   {value: 1e3, symbol: 'Th'},
    //   {value: 1e5, symbol: 'Lk'},
    //   {value: 1e7, symbol: 'Cr'},
    //   {value: 1e12, symbol: 'T'},
    //   {value: 1e15, symbol: 'P'},
    //   {value: 1e18, symbol: 'E'},
    // ];
    // const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    // var item = lookup
    //   .slice()
    //   .reverse()
    //   .find(function (item) {
    //     return num >= item.value;
    //   });
    // return item
    //   ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    //   : '0';
  },
  isDate: (str: any) => {
    return new Date(str) !== 'Invalid Date' && !isNaN(new Date(str));
  },
  formateTime: (duration: number) => {
    return moment
      .utc(duration * 1000)
      .format(duration >= 3600 ? 'HH:mm:ss' : 'mm:ss');
  },
  splitPhoneOnly: (phone: string) => {
    if (phone && phone.length && phone.length > 10) {
      phone = String(phone).replace(/\s/g, '');
      const revPhone = phone.split('').reverse().join('');
      const phoneNumber = revPhone.substring(0, 10);
      const countryCode = revPhone.substring(10, phone.length);

      return {
        countyCode: countryCode.split('').reverse().join(''),
        phoneNumber: phoneNumber.split('').reverse().join(''),
      };
    }
    return {
      countyCode: '',
      phoneNumber: phone,
    };
  },
  getFileExtention: (fileUrl: string) => {
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  },
  validateOnlyPhone: (phone: string) => {
    var re = /^(\+[\d]{1,5}|0)?[7-9]\d{9}$/;
    return re.test(phone);
  },
  nosSuffix(i: string | number) {
    i = Number(i);
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + 'st';
    }
    if (j == 2 && k != 12) {
      return i + 'nd';
    }
    if (j == 3 && k != 13) {
      return i + 'rd';
    }
    return i + 'th';
  },
  nFormatter(num: number, digits: number | undefined) {
    var si = [
      {value: 1, symbol: ''},
      {value: 1e3, symbol: 'k'},
      {value: 1e6, symbol: 'M'},
      {value: 1e9, symbol: 'G'},
      {value: 1e12, symbol: 'T'},
      {value: 1e15, symbol: 'P'},
      {value: 1e18, symbol: 'E'},
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  },
  getTime: (timeStamp: string | number | Date, type = 1, source = null) => {
    if (type !== 3) timeStamp = !timeStamp ? new Date() : timeStamp;
    let date1 = new Date(timeStamp);
    let date2 = new Date();
    let diffTime = date2.getTime() - date1.getTime();
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    var diffSeconds = (date2.getTime() - date1.getTime()) / 1000;
    let unit = 'days';
    let diffText = '';
    if (type == 1) {
      if (diffDays >= 365) {
        diffDays = parseInt(diffDays / 365);
        unit = diffDays == 1 ? 'year' : 'years';
        diffText = diffDays;
      } else if (diffDays >= 7) {
        diffDays = parseInt(diffDays / 7);
        unit = diffDays == 1 ? 'week' : 'weeks';
        diffText = diffDays;
      } else if (diffDays > 0) {
        unit = diffDays == 1 ? 'day' : 'days';
        diffText = diffDays;
      } else if (diffSeconds > 3600) {
        diffSeconds = parseInt(diffSeconds / 3600);
        unit = diffSeconds < 2 ? 'hour' : 'hours';
        diffText = diffSeconds;
      } else if (diffSeconds > 60) {
        diffSeconds = parseInt(diffSeconds / 60);
        unit = diffSeconds < 2 ? 'minute' : 'minutes';
        diffText = diffSeconds;
      } else {
        unit = parseInt(diffSeconds) <= 1 ? 'second' : 'seconds';
        diffText = parseInt(diffSeconds);
      }
      return source == 'Assign to you'
        ? `Lead Assigned ${diffText} ${unit} ago`
        : ` ${source} ${diffText} ${unit} ago`;
    } else if (type == 2) {
      let formattedTimeStamp = functions.formatTimeStamp(timeStamp);
      if (diffDays > 1) {
        return `${formattedTimeStamp.DD} ${formattedTimeStamp.MMM} ${formattedTimeStamp.YYYY}`;
      } else if (diffDays == 1) {
        return 'Yesterday';
      } else {
        return `${formattedTimeStamp.hh} : ${formattedTimeStamp.mm} ${formattedTimeStamp.ampm}`.toUpperCase();
      }
    } else if (type == 3) {
      let formattedTimeStamp = functions.formatTimeStamp(timeStamp);
      return `${formattedTimeStamp.DD} ${formattedTimeStamp.MMM} ${formattedTimeStamp.YYYY}`;
    }
  },
  formatAddedTime: (timeStamp: Date | string) => {
    let date1 = new Date(timeStamp);
    let date2 = new Date();
    let diffSeconds = (date2.getTime() - date1.getTime()) / 1000;
    let unit = 'days';
    let diffText = '';
    if (diffSeconds < 3600) {
      if (diffSeconds > 60) {
        diffSeconds = diffSeconds / 60;
        unit = diffSeconds < 2 ? 'minute' : 'minutes';
        diffText = `${diffSeconds.toFixed(0)}`;
        return `${diffText} ${unit} ago`;
      } else {
        unit = diffSeconds <= 1 ? 'second' : 'seconds';
        diffText = `${diffSeconds.toFixed(0)}`;
        return `${diffText} ${unit} ago`;
      }
    }
    return moment(timeStamp).format('DD MMM YYYY HH:mm');
  },
  getTimeStamp: () => {
    let dateTime = new Date();
    return dateTime;
  },
  formatTimeStamp: (timeStamp: string | number | Date) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let dateTime = new Date(timeStamp);
    let YYYY = dateTime.getFullYear();
    let MM = pad(dateTime.getMonth() + 1);
    let DD = pad(dateTime.getDate());
    let hh = dateTime.getHours();
    let mm = pad(dateTime.getMinutes());
    let ss = pad(dateTime.getSeconds());
    let ampm = hh >= 12 ? 'pm' : 'am';
    hh = pad(hh % 12);
    hh = hh == '00' ? '12' : hh;
    return {
      YYYY,
      MM,
      MMM: months[dateTime.getMonth()],
      DD,
      hh,
      mm,
      ss,
      ampm,
    };
  },
  pickImageFromGallery: async (multiple = true) => {
    let selectedImage = null;
    await ImagePicker.openPicker({
      mediaType: 'photo',
      multiple,
      compressImageQuality: 0.6,
    }).then(image => {
      selectedImage = image;
    });
    return selectedImage;
  },
  pickFile: async (type, multiple = false) => {
    try {
      const res = multiple
        ? await DocumentPicker.pickMultiple({
            type: [type ? type : DocumentPicker.types.allFiles],
          })
        : await DocumentPicker.pick({
            type: [type ? type : DocumentPicker.types.allFiles],
          });
      return res;
    } catch (err) {
      return null;
    }
  },
  isJsonNull: (jsonObj: {[x: string]: null}) => {
    for (let key in jsonObj) {
      if (jsonObj[key] != null) {
        return false;
      }
    }
    return true;
  },
  formatFileSize: (size: string) => {
    if (Number.isNaN(parseInt(size))) {
      return '0 B';
    }
    if (parseInt(size) >= 1024000000) {
      return `${(parseInt(size) / 1024000000).toFixed(1)} GB`;
    }
    if (parseInt(size) >= 1024000) {
      return `${(parseInt(size) / 1024000).toFixed(1)} MB`;
    }
    if (parseInt(size) >= 1024) {
      return `${(parseInt(size) / 1024).toFixed(1)} KB`;
    }
    return `${(parseInt(size) / 1024).toFixed(1)} B`;
  },
  getItem: (arr: {[x: string]: any}, val: any) => {
    for (let index in arr) {
      const item = arr[index];
      if (item.value == val) {
        return item;
      }
    }
  },
  checkDateInRange: (timeStamp: moment.MomentInput, toCheck: any) => {
    const momentDate = moment(timeStamp);
    const REFERENCE = moment();
    const YESTERDAY = REFERENCE.clone().subtract(1, 'days');
    const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days');
    const A_MONTH_OLD = REFERENCE.clone().subtract(30, 'days');

    switch (toCheck) {
      case '24h':
        if (momentDate.isSameOrAfter(YESTERDAY, 'd')) {
          return true;
        }
        return false;
      case '7d':
        if (momentDate.isSameOrAfter(A_WEEK_OLD, 'd')) {
          return true;
        }
        return false;
      case '30d':
        if (momentDate.isSameOrAfter(A_MONTH_OLD, 'd')) {
          return true;
        }
        return false;
    }
  },
  chatWithUs: () => {
    Linking.openURL(`whatsapp://send?phone=${apiKeys.whatsAppNo}`);
  },
  currencyFormate: (number: string | number, noDecimal: any = false) => {
    if (number) {
      const num = noDecimal ? parseInt(number) : parseFloat(number).toFixed(0);
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number || '0.00';
  },
  currencyFormateForInput: (
    number: string | number,
    noDecimal: any = false,
  ) => {
    if (number) {
      const num = noDecimal ? parseInt(number) : parseFloat(number).toFixed(0);
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number || '';
  },
};
const apiKeys = {
  whatsAppNo: '+918814048362',
  smsAuthKey: 'ad3068671f437b72',
  smsSid: '3335',
  smsVid: '128',
};
export default Helper;
