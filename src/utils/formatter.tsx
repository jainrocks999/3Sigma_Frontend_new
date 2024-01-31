import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppImages from 'resources/images';
import R from 'resources/R';
import {Image} from 'react-native';

export const activityFormat = (activityType: string, activityData: any) => {
  // const activity_types = {
  //   label_update: `Lead label updated to ${
  //     activityData?.prev_label ? activityData?.prev_label : 'NA'
  //   }`,
  //   status_update: `Lead status updated to ${
  //     activityData?.prev_status ? activityData?.prev_status : 'NA'
  //   }`,
  //   task_create: `${activityData?.type} : Task created`,
  //   task_is_complete_update: `${activityData?.type} : Marked as completed`,
  //   task_due_date_update: `${activityData?.type} : Due date updated`,
  //   task_assign_update: `${activityData?.type} : Task assigned to ${
  //     activityData?.task_assigned_to_name || 'NA'
  //   }`,
  //   note_create: 'Added new note',
  //   task_delete: 'Task deleted',
  //   lead_updated: 'Lead updated',
  //   meeting: 'Meeting',
  // };
  if (activityType) {
    const type = activityType.toLowerCase();
    switch (type) {
      case 'call':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'phone-outline'}
              color={'#15661f'}
              size={22}
            />
          ),
          seenText: 'Was called by you.',
          seenTextClient: 'called you',
        };
      case 'incoming':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'phone-incoming'}
              color={'#15661f'}
              size={20}
            />
          ),
          seenText: 'called you',
        };
      case 'checkin':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialIcons name={'place'} color={'#15661f'} size={20} />
          ),
          seenText: 'You checked in',
        };
      case 'checkout':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialIcons name={'place'} color={'#15661f'} size={20} />
          ),
          seenText: 'You have checked out',
        };
      case 'transfer_lead':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'cog-transfer'}
              color={'#15661f'}
              size={20}
            />
          ),
          seenText: 'Lead transfered',
        };
      case 'outgoing':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'phone-outgoing'}
              color={'#3cb371'}
              size={20}
            />
          ),

          seenText: 'was called by you.',
        };
      case 'missed':
        return {
          ltCntColor: '#e7efe8',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'phone-missed'}
              color={'red'}
              size={20}
            />
          ),
          seenText: 'missed you',
        };
      case 'follow-up':
        return {
          ltCntColor: '#fbd9ff',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'reload'}
              color={'#ed66ff'}
              size={22}
            />
          ),
          seenText: 'was followed up by you',
          seenTextClient: 'had a follow up with you',
        };
      case 'send':
        return {
          ltCntColor: '#d4e4ff',
          ltCntIcon: (
            <MaterialCommunityIcons name={'send'} color={'#599aff'} size={22} />
          ),
          seenText: 'was send by you',
          seenTextClient: 'send you',
        };
      case 'email':
        return {
          ltCntColor: '#ffe8f0',
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'email-open-outline'}
              color={'#ff216a'}
              size={20}
            />
          ),
          seenText: 'was mailed by you',
          seenTextClient: 'mailed you',
        };
      case 'message':
        return {
          ltCntColor: '#ffe8f0',
          ltCntIcon: (
            <Ionicons name={'chatbubble-outline'} color={'#FF216A'} size={20} />
          ),
          seenText: 'was messaged by you',
          seenTextClient: 'messaged you',
        };
      case 'video_call':
        return {
          ltCntColor: R.colors.themeCol2,
          ltCntIcon: (
            <MaterialCommunityIcons
              name={'video-outline'}
              color={R.colors.themeCol2}
              size={22}
            />
          ),
          seenText: 'was video called by you',
          seenTextClient: 'called you',
        };
      case 'view':
        return {
          ltCntColor: '#feefe8',
          ltCntIcon: (
            <MaterialIcons
              name={'insert-link'}
              color={'#f16520'}
              size={22}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          ),
          seenText: 'viewed your link',
          seenTextClient: 'viewed your link',
        };
      case 'move_lead':
        return {
          ltCntColor: '#feefe8',
          ltCntIcon: (
            <MaterialIcons
              name={'insert-link'}
              color={'#f16520'}
              size={22}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          ),
          seenText: 'Lead moved from {list1} to {list2}',
          seenTextClient: '',
        };
      case 'copy_lead':
        return {
          ltCntColor: '#feefe8',
          ltCntIcon: (
            <MaterialIcons
              name={'insert-link'}
              color={'#f16520'}
              size={22}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          ),
          seenText: 'Lead copied from {list1} to {list2}',
          seenTextClient: '',
        };
      default:
        return {
          ltCntColor: '#feefe8',
          ltCntIcon: (
            <MaterialIcons
              name={'insert-link'}
              color={'#f16520'}
              size={22}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          ),
          seenText: `${type.split('_').join(' ')}`,
          seenTextClient: '',
        };
    }
  } else {
    return null;
  }
};
export const fileType = (ext: string) => {
  const iconSize = 40;
  switch (ext) {
    case 'pdf':
      return (
        <MaterialCommunityIcons
          name={'file-pdf-box'}
          size={iconSize}
          color={R.colors.themeCol2}
        />
      );
    case 'png':
    case 'jpeg':
    case 'jpg':
      return (
        <MaterialCommunityIcons
          name={'image'}
          size={iconSize}
          color={R.colors.IndianRed}
        />
      );
    case 'xlsx':
    case 'xlsm':
    case 'xlsb':
    case 'xltx':
      return (
        <MaterialCommunityIcons
          name={'file-excel'}
          size={iconSize}
          color={R.colors.themeCol2}
        />
      );
    case 'doc':
    case 'docm':
    case 'docx':
    case 'dot':
      return (
        <MaterialCommunityIcons
          name={'file-document'}
          size={iconSize}
          color={R.colors.themeCol2}
        />
      );
    case 'csv':
      return (
        <MaterialCommunityIcons
          name={'file-delimited-outline'}
          size={iconSize}
          color={R.colors.themeCol2}
        />
      );
    default:
      return (
        <MaterialCommunityIcons
          name={'file'}
          size={iconSize}
          color={R.colors.stroke3}
        />
      );
  }
};
export const typeFormat = (type: string) => {
  if (
    type.includes('excel') ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return {
      icon: AppImages.excel,
      iconType: 'image',
      cntColor: '#feefe8',
      name: 'Excel',
    };
  }
  if (type.includes('image')) {
    return {
      icon: AppImages.jpeg,
      iconType: 'image',
      cntColor: '#eff1f3',
      name: 'JPEG',
    };
  }
  if (type.includes('pdf')) {
    return {
      icon: AppImages.pdf,
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
      icon: AppImages.page,
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
      icon: AppImages.justdial,
      iconType: 'image',
      cntColor: '#fff0e5',
      name: 'Just Dial',
      width: '90%',
    };
  }
  if (type.includes('zapier')) {
    return {
      icon: AppImages.zapier,
      iconType: 'image',
      cntColor: '#F8F8F8',
      name: 'Zapier',
      width: '90%',
    };
  }
  if (type.includes('indiamart')) {
    return {
      icon: AppImages.indiamart,
      iconType: 'image',
      cntColor: '#F8F8F8',
      name: 'Indiamart',
      width: '90%',
    };
  }
  if (type.includes('whatsapp')) {
    return {
      icon: AppImages.whatsappSolidIcon,
      iconType: 'image',
      cntColor: '#edf7ee',
      name: 'WhatsApp',
      width: '40%',
    };
  }
  if (type.includes('faq')) {
    return {
      icon: AppImages.faqIcon,
      iconType: 'image',
      cntColor: '#ffe8f0',
      width: '35%',
    };
  }
  if (type.includes('website')) {
    return {
      icon: AppImages.website,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Website',
    };
  }
  if (type.includes('wordpress')) {
    return {
      icon: AppImages.wordpress,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Wordpress Plugin',
    };
  }
  if (type.includes('google_lead_form')) {
    return {
      icon: AppImages.google_lead,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Google Lead Form',
    };
  }
  if (type.includes('typeform')) {
    return {
      icon: AppImages.type_form,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Type Form',
    };
  }
  if (type.includes('tradeindia')) {
    return {
      icon: AppImages.trade_india,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Trade India',
    };
  }
  if (type.includes('acere')) {
    return {
      icon: AppImages.acere,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: '99 Acere (Beta)',
    };
  }
  if (type.includes('housing')) {
    return {
      icon: AppImages.housing,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Housing.com (Beta)',
    };
  }
  if (type.includes('extension')) {
    return {
      icon: AppImages.extension,
      iconType: 'image',
      cntColor: '#e8f5fe',
      width: '100%',
      name: 'Whatsapp web extension',
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

export const taskFormat = (taskType: string) => {
  switch (taskType) {
    case 'follow_up':
      return {
        baseCol: '#ed66ff',
        ltCntColor: '#fbd9ff',
        ltCntIcon: (
          <MaterialCommunityIcons name={'reload'} color={'#ed66ff'} size={22} />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <MaterialCommunityIcons name={'reload'} color={'#000'} size={22} />
        ),
        title: 'Follow Up',
      };
    case 'send':
      return {
        baseCol: '#599aff',
        ltCntColor: '#d4e4ff',
        ltCntIcon: (
          <MaterialCommunityIcons name={'send'} color={'#599aff'} size={22} />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <MaterialCommunityIcons name={'send'} color={'#000'} size={22} />
        ),
        title: 'Send',
      };
    case 'call':
      return {
        baseCol: '#15661f',
        ltCntColor: '#e7efe8',
        ltCntIcon: (
          <MaterialCommunityIcons
            name={'phone-outline'}
            color={'#15661f'}
            size={22}
          />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <MaterialCommunityIcons
            name={'phone-outline'}
            color={'#000'}
            size={22}
          />
        ),
        title: 'Call',
      };
    case 'email':
      return {
        baseCol: '#ff216a',
        ltCntColor: '#ffe8f0',
        ltCntIcon: (
          <MaterialCommunityIcons
            name={'email-open-outline'}
            color={'#ff216a'}
            size={19}
          />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <MaterialCommunityIcons
            name={'email-open-outline'}
            color={'#000'}
            size={19}
          />
        ),
        title: 'Email',
      };
    case 'message':
      return {
        baseCol: '#FF216A',
        ltCntColor: '#ffe8f0',
        ltCntIcon: (
          <Ionicons name={'chatbubble-outline'} color={'#FF216A'} size={20} />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <Ionicons name={'chatbubble-outline'} color={'#000'} size={20} />
        ),
        title: 'Message',
      };
    case 'video_call':
      return {
        baseCol: R.colors.themeCol2,
        ltCntColor: `${R.colors.themeCol2}2f`,
        ltCntIcon: (
          <MaterialCommunityIcons
            name={'video-outline'}
            color={R.colors.themeCol2}
            size={22}
          />
        ),
        rtCntColor: '#e6e7ec',
        rtCntIcon: (
          <MaterialCommunityIcons
            name={'video-outline'}
            color={'#000'}
            size={22}
          />
        ),
        title: 'Video Call',
      };
    default:
      return {
        baseCol: R.colors.themeCol2,
        ltCntColor: R.colors.themeCol2,
        ltCntIcon: (
          <Image
            source={AppImages.activityTab}
            style={{
              height: 18,
              width: 18,
              resizeMode: 'contain',
              tintColor: '#fff',
            }}
          />
        ),
        rtCntIcon: (
          <Image
            source={AppImages.activityTab}
            style={{
              height: 18,
              width: 18,
              resizeMode: 'contain',
              tintColor: '#fff',
            }}
          />
        ),
        title: taskType,
      };
  }
};
