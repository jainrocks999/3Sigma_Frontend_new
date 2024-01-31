import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';

const excel = require('../images/excel.png');
const jpeg = require('../images/jpeg.png');
const pdf = require('../images/pdf.png');
const page = require('../images/page.png');
const justdial = require('../images/justdial.png');
const zapier = require('../images/zapier.png');
const indiamart = require('../images/indiamart.png');
const whatsappSolidIcon = require('../images/whatsapp-leads.png');
const faqIcon = require('../images/faq.png');
const website = require('../images/website.png');
const wordpress = require('../images/wordpress.png');
const google_lead = require('../images/google-forms.png');
const type_form = require('../images/typeform.png');
const trade_india = require('../images/tradeIndia.png');
const acere = require('../images/acere.png');
const housing = require('../images/housing.png');
const extension = require('../images/extension.png');
const magic = require('../images/magic.png');

export const fileFormats = (mime: string) => {
  if (mime.includes('image')) {
    return {
      icon: <FontAwesome5 name={'file-image'} color={'blue'} size={26} />,
      cntColor: 'blue',
    };
  }
  if (mime.includes('text')) {
    return {
      icon: <FontAwesome name={'file-text'} color={'grey'} size={26} />,
      cntColor: 'grey',
    };
  }
  if (mime.includes('audio')) {
    return {
      icon: <FontAwesome5 name={'file-audio'} color={'orange'} size={26} />,
      cntColor: 'orange',
    };
  }
  if (mime.includes('video')) {
    return {
      icon: <FontAwesome5 name={'file-video'} color={'orange'} size={26} />,
      cntColor: 'orange',
    };
  }
  if (mime.includes('pdf')) {
    return {
      icon: <FontAwesome5 name={'file-pdf'} color={'#F12E76'} size={26} />,
      cntColor: '#F12E76',
    };
  }
  if (mime.includes('zip') || mime.includes('rar')) {
    return {
      icon: <FontAwesome name={'file-zip-o'} color={'gold'} size={26} />,
      cntColor: 'gold',
    };
  }
  if (
    mime.includes('excel') ||
    mime === 'application/vnd.ms-excel' ||
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return {
      icon: <FontAwesome5 name={'file-excel'} color={'#1D6F42'} size={26} />,
      cntColor: '#1D6F42',
    };
  }
  if (mime.includes('csv')) {
    return {
      icon: (
        <FontAwesome5 name={'file-csv'} color={'lightseagreen'} size={26} />
      ),
      cntColor: 'lightseagreen',
    };
  }
  if (mime.includes('powerpoint')) {
    return {
      icon: (
        <FontAwesome5 name={'file-powerpoint'} color={'#D04423'} size={26} />
      ),
      cntColor: '#D04423',
    };
  }
  return {
    icon: <FontAwesome5 name={'file'} color={'gold'} size={26} />,
    cntColor: 'gold',
  };
};

export const typeFormat = (type: string) => {
  if (
    type.includes('excel') ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return {
      icon: excel,
      iconType: 'image',
      cntColor: '#feefe8',
      name: 'Excel',
    };
  }
  if (type.includes('image')) {
    return {
      icon: jpeg,
      iconType: 'image',
      cntColor: '#eff1f3',
      name: 'JPEG',
    };
  }
  if (type.includes('pdf')) {
    return {
      icon: pdf,
      iconType: 'image',
      cntColor: '#fee8f0',
      name: 'PDF',
    };
  }
  if (type.includes('csv')) {
    return {
      icon: (
        <FontAwesome5 name={'file-csv'} color={'lightseagreen'} size={22} />
      ),
      iconType: 'icon',
      cntColor: '#20b2aa22',
      name: 'CSV',
      width: '90%',
    };
  }
  if (type.includes('text')) {
    return {
      icon: <FontAwesome name={'file-text'} color={'grey'} size={18} />,
      iconType: 'icon',
      cntColor: '#80808030',
      name: 'Text',
    };
  }
  if (type.includes('page')) {
    return {
      icon: page,
      iconType: 'image',
      cntColor: '#edf7ed',
      name: 'Page',
    };
  }
  if (type.includes('message')) {
    return {
      icon: (
        <Ionicons name={'chatbubble-outline'} color={'#FF216A'} size={20} />
      ),
      iconType: 'icon',
      cntColor: '#ffe8f0',
      name: 'Message',
    };
  }
  if (type.includes('facebook')) {
    return {
      icon: <Ionicons name={'logo-facebook'} color={'#0078FF'} size={20} />,
      iconType: 'icon',
      cntColor: '#e8f5fe',
      name: 'Facebook',
    };
  }
  if (type.includes('justdial')) {
    return {
      icon: justdial,
      iconType: 'image',
      cntColor: '#fff0e5',
      name: 'Just Dial',
      width: '90%',
    };
  }
  if (type.includes('zapier')) {
    return {
      icon: zapier,
      iconType: 'image',
      cntColor: '#F8F8F8',
      name: 'Zapier',
      width: '90%',
    };
  }
  if (type.includes('indiamart')) {
    return {
      icon: indiamart,
      iconType: 'image',
      cntColor: '#F8F8F8',
      name: 'Indiamart',
      width: '90%',
    };
  }
  if (type.includes('whatsapp')) {
    return {
      icon: whatsappSolidIcon,
      iconType: 'image',
      cntColor: '#edf7ee',
      name: 'WhatsApp',
      width: '40%',
    };
  }
  if (type.includes('faq')) {
    return {
      icon: faqIcon,
      iconType: 'image',
      cntColor: '#ffe8f0',
      width: '35%',
    };
  }
  if (type.includes('website')) {
    return {
      icon: website,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Website',
    };
  }
  if (type.includes('wordpress')) {
    return {
      icon: wordpress,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Wordpress Plugin',
    };
  }
  if (type.includes('google_lead_form')) {
    return {
      icon: google_lead,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Google Lead Form',
    };
  }
  if (type.includes('typeform')) {
    return {
      icon: type_form,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Type Form',
    };
  }
  if (type.includes('tradeindia')) {
    return {
      icon: trade_india,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Trade India',
    };
  }
  if (type.includes('acere')) {
    return {
      icon: acere,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: '99 Acere (Beta)',
    };
  }
  if (type.includes('housing')) {
    return {
      icon: housing,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Housing.com (Beta)',
    };
  }
  if (type.includes('extension')) {
    return {
      icon: extension,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Whatsapp web extension',
    };
  }
  if (type.includes('magic_bricks')) {
    return {
      icon: magic,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Magic Bricks',
    };
  }
  return {
    icon: <FontAwesome5 name={'file'} color={'gold'} size={20} />,
    iconType: 'icon',
    cntColor: '#ffd70030',
    name: 'File',
    width: '35%',
  };
};
export default {typeFormat, fileFormats};
