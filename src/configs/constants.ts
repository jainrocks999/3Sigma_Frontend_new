import {FormField} from 'library/form-field/DynamicForm';
import {ContentTypeEnum} from '../models/common/content.enum';
import {PrefrenceKeyEnum} from '../models/common/preference.keys.enum';
import ScreenNameEnum from '../models/routes/screenName.enum';

export const COLOR_OPTIONS = [
  {
    name: 'Light Green',
    value: '#22e39e',
  },
  {
    name: 'Red',
    value: '#F1E5BC',
  },
  {
    name: 'Green',
    value: '#32cd32',
  },
  {
    name: 'Blue',
    value: '#0000ff',
  },
  {
    name: 'Yellow',
    value: '#ffd700',
  },
  {
    name: 'Violet',
    value: '#ee82ee',
  },
  {
    name: 'Pink',
    value: '#ffc0cb',
  },
  {
    name: 'Black',
    value: '#000',
  },
];
export const LABEL_COLOR_OPTION = [
  {
    name: 'Asda Green',
    value: '#22e39e',
  },
  {
    name: 'Lemon meringue',
    value: '#F1E5BC',
  },
  {
    name: 'Azureish white',
    value: '#DDECF0',
  },
  {
    name: 'Gin',
    value: '#CDE3C1',
  },
  {
    name: 'Palw blue',
    value: '#C5E9E3',
  },
  {
    name: 'Twitter blue',
    value: '#4EA5D2',
  },
  {
    name: 'English violet',
    value: '#524364',
  },
  {
    name: 'Yellow',
    value: '#ffd700',
  },
  {
    name: 'Violet',
    value: '#ee82ee',
  },
  {
    name: 'Pink',
    value: '#ffc022',
  },
  {
    name: 'Azureish white',
    value: '#DDEC23',
  },
  {
    name: 'Gin',
    value: '#CDE332',
  },
  {
    name: 'Palw blue',
    value: '#C5E9E5',
  },
  {
    name: 'Twitter blue',
    value: '#4EA5D1',
  },
  {
    name: 'English violet',
    value: '#524362',
  },
  {
    name: 'Yellow',
    value: '#ffd711',
  },
  {
    name: 'Violet',
    value: '#ee82ee',
  },
  {
    name: 'Pink',
    value: '#ffc0cb',
  },
  {
    name: 'Bronze',
    value: '#CD7F32',
  },
  {
    name: 'Tan',
    value: '#D2B48C',
  },
  {
    name: 'Teal',
    value: '#008080',
  },
  {
    name: 'Coral',
    value: '#FF7F50',
  },
  {
    name: 'Lavender',
    value: '#E6E6FA',
  },
  {
    name: 'Mauve',
    value: '#E0b0FF',
  },
  {
    name: 'Peach',
    value: '#FFE5B4',
  },
  {
    name: 'Turquoise',
    value: '#30D5C8',
  },
  {
    name: 'Amber',
    value: '#FFBF00',
  },
  {
    name: 'Mint',
    value: '#3EB489',
  },
  {
    name: 'DarkKhaki',
    value: '#BDB76B',
  },
  {
    name: 'MediumOrchid',
    value: '#BA55D3',
  },
  {
    name: 'Indigo',
    value: '#4B0082',
  },
  {
    name: 'MediumSeaGreen',
    value: '#3CB371',
  },
  {
    name: 'YellowGreen',
    value: '#9ACD32',
  },
  {
    name: 'Turquoise',
    value: '#40E0D0',
  },
  {
    name: 'SteelBlue',
    value: '#4682B4',
  },
  {
    name: 'BurlyWood',
    value: '#DEB887',
  },
  {
    name: 'Goldenrod',
    value: '#DAA520',
  },
  {
    name: 'MediumSlateBlue',
    value: '#7B68EE',
  },
  {
    name: 'DimGray',
    value: '#696969',
  },
  {
    name: 'LightSlateGray',
    value: '#778899',
  },
  {
    name: 'Beige',
    value: '#F5F5DC',
  },
];
export const STATUS_COLOR_OPTION = [
  {
    name: 'Maroon',
    value: '#72002B',
  },
  {
    name: 'Plum dyed ',
    value: '#F68E4F',
  },
  {
    name: 'Sun Ray',
    value: '#E5B464',
  },
  {
    name: 'Shampoo',
    value: '#FFC5F3',
  },
  {
    name: 'Codet Blue',
    value: '#649EA2',
  },
  {
    name: 'Irresistible',
    value: '#BA4769',
  },
  {
    name: 'Hot Pink',
    value: '#FF70BD',
  },
  {
    name: 'Emerald',
    value: '#50C878',
  },
  {
    name: 'Azure',
    value: '#1520A6',
  },
  {
    name: 'Electric',
    value: '#7EF9FF',
  },
];
export const CUSTOM_FIELD_TYPES = [
  {
    name: 'Text',
    value: 'input',
  },
  {
    name: 'Options',
    value: 'selection',
  },
  {
    name: 'Date',
    value: 'date',
  },
  {
    name: 'Address',
    value: 'location',
  },
];

export const DEFAULT_TASK_TYPES = [
  {
    name: 'Call',
    value: 'call',
    read_only: true,
  },
  {
    name: 'Meeting',
    value: 'meeting',
    read_only: true,
  },
  {
    name: 'Email',
    value: 'email',
    read_only: true,
  },
  {
    name: 'Message',
    value: 'message',
    read_only: true,
  },
  {
    name: 'Follow Up',
    value: 'follow_up',
    read_only: true,
  },
  {
    name: 'Send',
    value: 'send',
    read_only: true,
  },
  {
    name: 'Video Call',
    value: 'video_call',
    read_only: true,
  },
];

export const DEFAULT_ACTIVITY_TYPES = [
  {name: 'Call', value: 'call', read_only: true, customFileds: []},
  {name: 'Email', value: 'email', read_only: true, customFileds: []},
  {name: 'Meeting', value: 'meeting', read_only: true, customFileds: []},
  {name: 'Message', value: 'message', read_only: true, customFileds: []},
];

export const BULK_SELECTION_OPTIONS = [
  {
    name: 'Quick Share',
    value: 'share',
  },
  {
    name: 'Edit Status',
    value: 'status',
  },
  {
    name: 'Edit Label',
    value: 'label',
  },
  {
    name: 'Copy to list',
    value: 'copy_list',
  },

  {
    name: 'Move to list',
    value: 'move_list',
  },
  {
    name: 'Bulk Assign',
    value: 'assign',
  },
  {
    name: 'Delete',
    value: 'delete',
  },
  {
    name: 'Bulk Tasks',
    value: 'task',
  },
];
export const BULK_SELECTION_OPTIONS_EMPLOYEE = [
  {
    name: 'Quick Share',
    value: 'share',
  },
  {
    name: 'Edit Status',
    value: 'status',
  },
  {
    name: 'Edit Label',
    value: 'label',
  },
  {
    name: 'Copy to list',
    value: 'copy_list',
  },

  {
    name: 'Move to list',
    value: 'move_list',
  },
  {
    name: 'Bulk Assign',
    value: 'assign',
  },
  {
    name: 'Delete',
    value: 'delete',
  },
  {
    name: 'Bulk Tasks',
    value: 'task',
  },
  {
    name: 'Manage Tasks',
    value: 'task',
  },
];

export const TASK_DUE_DATES = [
  {
    name: 'Today',
    value: 'today',
  },
  {
    name: 'Tomorrow',
    value: 'tomorrow',
  },
  {
    name: '3 days from now',
    value: '3d',
  },
  {
    name: '1 week from now',
    value: '1w',
  },
  {
    name: '1 month from now',
    value: '1m',
  },
  {
    name: 'Custom',
    value: 'custom',
  },
];

export const CATEGORY_UNIT = [
  {
    value: 'pet',
    name: 'peti',
  },
  {
    value: 'jar',
    name: 'jars',
  },
  {
    value: 'poch',
    name: 'pouch',
  },
  {
    value: 'bor',
    name: 'bora',
  },
  {
    value: 'jar',
    name: 'jars',
  },
  {
    value: 'ft',
    name: 'feet',
  },
  {
    value: 'in',
    name: 'inches',
  },
  {
    value: 'case',
    name: 'case',
  },
  {
    value: 'each',
    name: 'each',
  },
  {
    value: 'cps',
    name: 'capsules',
  },
  {
    value: 'pcs',
    name: 'pieces',
  },
  {
    value: 'prs',
    name: 'pairs',
  },
  {
    value: 'qtl',
    name: 'quintals',
  },
  {
    value: 'rol',
    name: 'rolls',
  },
  {
    value: 'set',
    name: 'sets',
  },
  {
    value: 'sqf',
    name: 'square feet',
  },
  {
    value: 'sqm',
    name: 'square meters',
  },
  {
    value: 'sqy',
    name: 'square yards',
  },
  {
    value: 'tbs',
    name: 'tablets',
  },
  {
    value: 'thd',
    name: 'thousands',
  },
  {
    value: 'ton',
    name: 'tonnes',
  },
  {
    value: 'unt',
    name: 'units',
  },
  {
    value: 'yds',
    name: 'yards',
  },
  {
    value: 'hrs',
    name: 'hours',
  },
  {
    value: 'mins',
    name: 'minutes',
  },
  {
    value: 'ltr',
    name: 'litres',
  },
  {
    value: 'mton',
    name: 'metric ton',
  },
  {
    value: 'mlg',
    name: 'milligram',
  },
  {
    value: 'cft',
    name: 'cubuc foot',
  },
  {
    value: 'box',
    name: 'box',
  },
  {
    value: 'cbm',
    name: 'cubic meter',
  },
  {
    value: 'cms',
    name: 'centimeter',
  },
  {
    value: 'kgs',
    name: 'kilograms',
  },
  {
    value: 'mtr',
    name: 'meter',
  },
  {
    value: 'rft',
    name: 'running foot',
  },
  {
    value: 'uom',
    name: 'months',
  },
];

const LABEL_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    maxLength: 100,
  },
  {
    value: 'color',
    isRequired: true,
    type: 'selection',
    label: 'Color',
    displayColor: true,
    options: LABEL_COLOR_OPTION,
  },
  {
    value: 'isDefault',
    type: 'checkbox',
    label: 'Is Default',
  },
];
const STATUS_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    maxLength: 100,
  },
  {
    value: 'color',
    isRequired: true,
    type: 'selection',
    label: 'Color',
    displayColor: true,
    options: STATUS_COLOR_OPTION,
  },
  {
    value: 'isDefault',
    type: 'checkbox',
    label: 'Is Default',
  },
  {
    value: 'isSaleStatus',
    type: 'checkbox',
    label: 'Is Sale Status',
  },
];
const TASK_ACTIVITY_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    maxLength: 100,
  },
  {
    value: 'customFields',
    isRequired: true,
    type: 'form_fields_picker',
    label: 'Custom Fields',
    options: [
      {name: 'Text', value: 'text'},
      {name: 'Number', value: 'number'},
      {name: 'Phone', value: 'phone'},
      {name: 'Amount', value: 'amount'},
      {name: 'Address', value: 'location'},
      {name: 'Options', value: 'selection'},
      {name: 'Date', value: 'date'},
      {name: 'Time', value: 'time'},
    ],
  },
];
const TASK_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
  },
];
const LEAD_FORM_FIELD: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    placeholder: 'Field Name',
  },
  {
    value: 'type',
    isRequired: true,
    optionCreator: true,
    type: 'selection',
    label: 'Type',
    placeholder: 'Select field type',
    options: [
      {name: 'Text', value: 'text'},
      {name: 'Number', value: 'number'},
      {name: 'Phone', value: 'phone'},
      {name: 'Amount', value: 'amount'},
      {name: 'Address', value: 'location'},
      {name: 'Options', value: 'selection'},
      // {name: 'Multi-Option', value: 'multi-selection'},
      {name: 'Date', value: 'date'},
      {name: 'Time', value: 'time'},
    ],
  },
  {
    value: 'isRequired',
    type: 'checkbox',
    label: 'Is Required',
  },
  //   {
  //     value: 'icon',
  //     isRequired: true,
  //     type: 'selection',
  //     label: 'Icon',
  //     read_only: true,
  //     options: ['a', 'b'],
  //   },
];
export const PREF_FORMS_FIELDS = {
  [PrefrenceKeyEnum.LABELS]: LABEL_FORM,
  [PrefrenceKeyEnum.STATUS]: STATUS_FORM,
  [PrefrenceKeyEnum.LEAD_FORM]: LEAD_FORM_FIELD,
  [PrefrenceKeyEnum.TASK_TYPE]: TASK_FORM,
  [PrefrenceKeyEnum.ACTIVITY_TYPE]: TASK_ACTIVITY_FORM,
};
export const DEFAULT_LEAD_FORM: Array<Object> = [
  {
    name: 'Name',
    value: 'name',
    isRequired: true,
    type: 'name',
    label: 'Client Name',
    read_only: true,
    similarNames: [
      'name',
      'full_name',
      'full name',
      'first name',
      'first_name',
    ],
  },
  {
    name: 'Email',
    value: 'email',
    isRequired: false,
    type: 'email',
    label: 'Email ID',
    read_only: true,
    similarNames: ['email', 'emailid'],
  },
  {
    name: 'Phone',
    value: 'phone',
    isRequired: true,
    type: 'phone',
    label: 'Phone Number',
    read_only: true,
    similarNames: [
      'phone',
      'mobile',
      'mobile number',
      'phone number',
      'telephone',
      'mobile number',
      'cellphone',
      'cellphone number',
    ],
  },
  {
    name: 'Alternate Phone',
    value: 'alternate_phone',
    isRequired: false,
    type: 'phone',
    label: 'Alternate Phone Number',
    read_only: false,
  },
  //   {
  //     name: 'Company Name',
  //     value: 'companyName',
  //     isRequired: false,
  //     type: 'company_name',
  //     label: 'Company Name',
  //     read_only: false,
  //   },
  // {
  //   name: 'Website',
  //   value: 'website',
  //   isRequired: false,
  //   type: 'website',
  //   label: 'Website',
  //   read_only: false,
  //   similarNames: ['website'],
  // },
  {
    name: 'Sale Value',
    value: 'saleValue',
    isRequired: false,
    type: 'amount',
    label: 'Sale Value',
    read_only: true,
    similarNames: ['salevalue', 'sale amount', 'sale value'],
  },
  // {
  //   name: 'Address',
  //   value: 'address',
  //   isRequired: false,
  //   type: 'location',
  //   label: 'Address',
  //   read_only: false,
  //   similarNames: ['address', 'location'],
  // },
  {
    name: 'Notes',
    value: 'notes',
    isRequired: false,
    type: 'text',
    label: 'Notes',
    read_only: false,
    similarNames: ['note', 'notes'],
    multiLine: true,
  },
];
export const DEFAULT_LEAD_SOURCE = [
  {
    value: 'leadForm',
    name: 'Lead Form ',
  },
  {
    value: 'phonebook',
    name: 'PhoneBook',
  },
];

export const ADD_TEAM_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
  },
  {
    value: 'teamLeader',
    type: 'user_picker',
    label: 'Team Leader',
    options: [],
    disable: true,
  },
  // {
  //   value: 'reportTo',
  //   type: 'user_picker',
  //   label: 'This team reports to',
  //   options: [],
  // },
];
export const ADD_TEAM_MEMBER: Array<FormField> = [
  {
    value: 'role',
    isRequired: true,
    type: 'selection',
    label: 'User type',
    options: [],
  },
  {
    value: 'teams',
    isRequired: false,
    multiSelect: false,
    type: 'team_picker',
    label: 'Select Team',
    options: [],
  },
  {
    value: 'reportTo',
    type: 'user_picker',
    label: 'Reports to',
    options: [],
    disable: false,
  },
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
  },
  {
    value: 'phone',
    isRequired: true,
    type: 'phone_with_country',
    label: 'Phone number',
  },
  {
    value: 'salesTarget',
    type: 'amount',
    label: 'Sales Target',
  },
  {
    value: 'transferData',
    type: 'user_picker',
    label: 'Transfer all data',
    placeholder: 'Transfer all data',
    disable: true,
  },
  {
    value: 'isActive',
    type: 'checkbox',
    label: 'Is Active',
    disable: false,
  },
];
export const DefaultTaskType = [
  {name: 'Call', value: 'Call'},
  {name: 'Meeting', value: 'Meeting'},
  {name: 'Email', value: 'Email'},
  {name: 'Message', value: 'Message'},
  {name: 'Follow Up', value: 'Follow Up'},
  {name: 'Send', value: 'Send'},
  {name: 'Video Call', value: 'Video Call'},
];

export const DueDateOptions = [
  {name: 'Today', value: '0'},
  {name: 'Tomorrow', value: '1'},
  {name: '3 days from now', value: '3'},
  {name: '1 week from now', value: '7'},
  {name: '1 month from now', value: '30'},
  {name: 'Custom Date', value: 'custom'},
];
export const PastDateOptions = [
  {name: 'Today', value: '0'},
  {name: 'Yesterday', value: '1'},
  {name: 'Last 7 days', value: '7'},
  {name: 'Last 15 days', value: '15'},
  {name: 'Last month', value: '30'},
  {name: 'Last quarter', value: '90'},
  {name: 'Custom Date', value: 'custom'},
];
export const PastDaysOptions = [
  {name: 'Today', value: '0'},
  {name: 'Yesterday', value: '1'},
  {name: 'Last 7 Days', value: '7'},
  {name: 'Last 15 Days', value: '15'},
  {name: 'Last 30 Days', value: '30'},
  {name: 'Custom Date', value: 'custom'},
];

export const RepeatOptions = [
  {name: 'Everyday', value: 'Everyday'},
  {name: 'Weekly', value: 'Weekly'},
  {name: 'Monthly', value: 'Monthly'},
  {name: 'Yearly', value: 'Yearly'},
  {name: "Don't repeat", value: 'NoRepeat'},
];

export const ActivityTypeOptions = [
  {name: 'Call', value: 'Call'},
  {name: 'Meeting', value: 'Meeting'},
  {name: 'Email', value: 'Email'},
  {name: 'Message', value: 'Message'},
];
export const TeamSizeOptions = [
  {name: '1', value: '1'},
  {name: '1 - 5', value: '5'},
  {name: '5 - 10', value: '10'},
  {name: '10 - 20', value: '20'},
  {name: '20  - 50', value: '50'},
  {name: '50 - 100', value: '100'},
];

export const LEAD_BULK_ACTIONS = [
  {
    name: 'Quick Share',
    value: 'share',
    icon: 'share-all-outline',
    restrictedRole: [],
  },

  {
    name: 'Edit Status',
    value: 'status',
    icon: 'account-star-outline',
    restrictedRole: [],
  },
  {
    name: 'Edit Label',
    value: 'label',
    icon: 'clock-time-one-outline',
    restrictedRole: [],
  },
  {
    name: 'Copy to list',
    value: 'copy_list',
    icon: 'content-copy',
    restrictedRole: [],
  },

  {
    name: 'Move to list',
    value: 'move_list',
    icon: 'file-move',
    restrictedRole: [],
  },
  {
    name: 'Bulk Assign',
    value: 'assign',
    icon: 'account-multiple-plus',
    restrictedRole: [],
  },
  {
    name: 'Delete',
    value: 'delete',
    icon: 'trash-can-outline',
    restrictedRole: ['employee'],
  },
  {
    name: 'Bulk Tasks',
    value: 'task',
    icon: 'calendar-outline',
    restrictedRole: [],
  },
];
export const LEAD_OPTION_ACTIONS: any = [
  {name: 'Edit Lead', value: 'edit', icon: 'pencil'},
  {name: 'Add To Phonebook', value: 'phonebook', icon: 'phone-plus'},
  {name: 'Assign Lead', value: 'assign', icon: 'account-multiple-plus'},
  // {name: 'Checkin', value: 'checkin'},
  {name: 'Copy lead to list', value: 'copy_list', icon: 'content-copy'},
  {name: 'Move lead to list', value: 'move_list', icon: 'file-move'},
  {name: 'Quick Share', value: 'quick_share', icon: 'share'},
  {name: 'Create Quotation', value: 'add_quotation', icon: 'currency-usd'},
  {name: 'Delete Lead', value: 'delete', icon: 'trash-can-outline'},
];

export const LEAD_OPTION_ACTIONS_NON_DELETABLE: any = [
  {name: 'Edit Lead', value: 'edit', icon: 'pencil'},
  {name: 'Add To Phonebook', value: 'phonebook', icon: 'phone-plus'},
  {name: 'Assign Lead', value: 'assign', icon: 'account-multiple-plus'},
  // {name: 'Checkin', value: 'checkin'},
  {name: 'Copy lead to list', value: 'copy_list', icon: 'content-copy'},
  {name: 'Move lead to list', value: 'move_list', icon: 'file-move'},
  {name: 'Quick Share', value: 'quick_share', icon: 'share'},
  {name: 'Create Quotation', value: 'add_quotation', icon: 'currency-usd'},
];
export const DIGITAL_CARD_SHARE_OPTIONS: any = [
  {name: 'File', value: 'file', icon: 'file-document', iconcolor: '#3FAEFD'},
  {name: 'Link', value: 'link', icon: 'link-variant', iconcolor: '#0DA30A'},
];
export const CALL_OPTION_ACTIONS: any = [
  {name: 'Call', value: 'call', icon: 'phone-outline', iconcolor: '#3FAEFD'},
  {name: 'Whatsapp', value: 'whatsapp', icon: 'whatsapp', iconcolor: '#25D366'},
  {
    name: 'Message',
    value: 'message',
    icon: 'message-outline',
    iconcolor: '#00B2FF',
  },
  // {
  //   name: 'Call history',
  //   value: 'call-history',
  //   icon: 'history',
  //   iconcolor: '#E52165',
  // },
];
export const CONTENT_OPTION_ACTIONS: any = {
  [ContentTypeEnum.PAGE]: [
    {name: 'Share', value: 'share', icon: 'share'},
    {name: 'Edit', value: 'edit', icon: 'pencil'},
    {name: 'Preview', value: 'preview', icon: 'eye'},
    {name: 'Copy Page Link', value: 'copy_link', icon: 'content-copy'},
    {name: 'Delete', value: 'delete', icon: 'trash-can-outline'},
  ],
  [ContentTypeEnum.FILE]: [
    {name: 'Share', value: 'share', icon: 'share'},
    {name: 'Edit', value: 'edit', icon: 'pencil'},
    {name: 'Preview', value: 'preview', icon: 'eye'},
    {name: 'Copy File Link', value: 'copy_link', icon: 'content-copy'},
    {name: 'Delete', value: 'delete', icon: 'trash-can-outline'},
  ],
  [ContentTypeEnum.MESSAGE]: [
    {name: 'Share', value: 'share', icon: 'share'},
    {name: 'Edit', value: 'edit', icon: 'pencil'},
    {name: 'Delete', value: 'delete', icon: 'trash-can-outline'},
  ],
};
export const QUOTATION_OPTION_ACTIONS = [
  // {name: 'Share', value: 'share'},
  {name: 'Edit', value: 'edit'},
  // {name: 'Preview', value: 'preview'},
  {name: 'Approve', value: 'approve'},
  {name: 'Delete', value: 'delete'},
];
export const SHARE_VIA = [
  {name: 'Whatsapp', value: 'whatsapp', icon: 'whatsapp'},
  {name: 'Message', value: 'message', icon: 'android-messages'},
  {name: 'Email', value: 'email', icon: 'email'},
];
export const ONBOARDING_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    disable: false,
  },
  {
    value: 'phone',
    isRequired: true,
    type: 'phone_with_country',
    label: 'Contact number',
    disable: false,
  },
  {
    value: 'email',
    isRequired: true,
    type: 'email',
    label: 'Email',
    isVerifyBlock: true,
    verify: false,
    disable: false,
  },
  {
    value: 'companyName',
    isRequired: true,
    type: 'text',
    label: 'Company Name',
    disable: false,
  },
  {
    value: 'teamSize',
    isRequired: true,
    type: 'selection',
    label: 'What is your team size?',
    options: TeamSizeOptions,
    disable: true,
  },
];
export const USER_PROFILE_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    disable: false,
  },
  {
    value: 'phone',
    isRequired: true,
    type: 'phone_with_country',
    label: 'Contact number',
    disable: false,
  },
  {
    value: 'email',
    isRequired: true,
    type: 'email',
    label: 'Email',
    isVerifyBlock: true,
    verify: false,
    disable: false,
  },
  {
    value: 'companyName',
    isRequired: true,
    type: 'text',
    label: 'Company Name',
    disable: false,
  },
  {
    value: 'teamSize',
    isRequired: true,
    type: 'selection',
    label: 'What is your team size?',
    options: TeamSizeOptions,
    disable: true,
  },
];
export const CATEGORY_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
  },
  {
    value: 'color',
    isRequired: true,
    type: 'selection',
    label: 'Color',
    displayColor: true,
    options: STATUS_COLOR_OPTION,
  },
];
export const PRODUCT_FORM: Array<FormField> = [
  {
    value: 'category',
    isRequired: true,
    type: 'selection',
    displayColor: true,
    label: 'Category',
    options: [],
    disable: false,
  },
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
  },
  {
    value: 'description',
    isRequired: true,
    type: 'text',
    label: 'Description',
    multiLine: true,
  },
  {
    value: 'currency',
    isRequired: true,
    type: 'selection',
    label: 'Currency',
    options: [
      {
        name: 'Indial Rupee (INR)',
        value: 'INR',
      },
    ],
  },
  {
    value: 'unitType',
    isRequired: true,
    type: 'selection',
    label: 'Unit Type',
    options: CATEGORY_UNIT,
  },
  {
    value: 'price',
    isRequired: true,
    type: 'amount',
    label: 'Price',
  },
];

export const QUOTATION_FORM: Array<FormField> = [
  {
    value: 'lead',
    type: 'lead_picker',
    label: 'Select Leads',
    isRequired: true,
    disable: false,
  },
  {
    value: 'title',
    isRequired: true,
    type: 'text',
    label: 'Title',
    disable: false,
  },
  {
    value: 'products',
    type: 'product_picker',
    label: 'Add Product',
  },

  {
    value: 'additionalCharges',
    type: 'additional_charges',
    label: 'Additional Charges',
    placeholder: 'Charge title',
    options: [
      {name: 'Fixed', value: 'fixed'},
      {name: 'Percent', value: 'rate'},
    ],
    defaultOption: 'fixed',
  },
  {
    value: 'discount',
    type: 'discount',
    label: 'Discount',

    options: [
      {name: 'Fixed', value: 'fixed'},
      {name: 'Percent', value: 'rate'},
    ],
  },
  {
    value: 'taxes',
    type: 'additional_charges',
    label: 'Taxes',
    showOptions: true,
    placeholder: 'Tax title',
    options: [{name: 'Percent', value: 'rate'}],
    defaultOption: 'rate',
  },
];
export const QUOTATION_FILTER_FORM: Array<FormField> = [
  {
    value: 'lead',
    type: 'lead_picker',
    label: 'Select Leads',
    disable: false,
  },
];
export const DIGITAL_CARD_FORM: Array<FormField> = [
  {
    value: 'name',
    isRequired: true,
    type: 'text',
    label: 'Name',
    disable: false,
  },
  {
    value: 'email',
    isRequired: true,
    type: 'email',
    label: 'Email',
    disable: false,
  },
  {
    value: 'phone',
    isRequired: true,
    type: 'phone',
    label: 'Phone number',
    disable: false,
  },
  {
    value: 'whatsapp',
    type: 'phone',
    label: 'Whatsapp number',
    disable: false,
  },
  {
    value: 'designation',
    type: 'text',
    label: 'Designation',
    disable: false,
  },
  {
    value: 'companyName',
    type: 'text',
    label: 'Company Name',
    disable: false,
  },
  {
    value: 'companyAddress',
    type: 'text',
    label: 'Company Address',
    disable: false,
  },
  {
    value: 'briefDescription',
    type: 'text',
    label: 'Intro',
    disable: false,
  },
  {
    value: 'website',
    type: 'text',
    label: 'Website',
    disable: false,
  },
  {
    value: 'facebook',
    type: 'text',
    label: 'Facebook',
    disable: false,
  },
  {
    value: 'instagram',
    type: 'text',
    label: 'Instagram',
    disable: false,
  },
  {
    value: 'linkedIn',
    type: 'text',
    label: 'LinkedIn',
    disable: false,
  },
  {
    value: 'googleCalendar',
    type: 'text',
    label: 'Google Calendar',
    disable: false,
  },
];
export const YOUTUBE_LINK = {
  [ScreenNameEnum.FOLLOW_UP_HOME_SCREEN]: 'mrBgJULysOg',
  [ScreenNameEnum.MANAGE_INTEGRATION_SCREEN]: 'WOD-7iTukIk',
  [ScreenNameEnum.DISTRIBUTION_SETTING_SCREEN]: 'LOxbzs8Qws0',
  [ScreenNameEnum.MY_TEAM_SCREEN]: 'T8o9-wLBHi4',
  [ScreenNameEnum.LEAD_HOME_SCREEN]: 'S3D7efFB5lE',
  [ScreenNameEnum.QUOTATION_LIST_SCREEN]: 'S3D7efFB5lE',
  [ScreenNameEnum.SUBSCRIPTION_SCREEN]: 'S3D7efFB5lE',
};
export const APP_TOUR = {
  [ScreenNameEnum.LEAD_HOME_SCREEN]: {
    leadList: {
      zone: 1,
      text: 'Manage your lead with customized lists',
    },
    search: {
      zone: 2,
      shape: 'circle',
      text: 'Search lead with name or mobile number',
    },
    filter: {
      zone: 3,
      shape: 'circle',
      text: 'Filter your leads as demand',
    },
    autoDialer: {
      zone: 4,
      shape: 'circle',
      text: 'Maange autodialer',
    },
    addLead: {
      zone: 5,
      shape: 'circle',
      text: 'Add you first lead',
    },
  },
};
