interface TextHelperType {
  limitText: (text: string, defaultLimit?: number, ending?: string) => string;
  beautifyTitle: (words: string) => string;
  formatCommaString: (preString: string) => string;
}

const TextHelper: TextHelperType = {
  limitText: (text: string, defaultLimit = 15, ending = '...') => {
    let result = '';
    if (text) {
      if (text.length > defaultLimit) {
        result = text.substring(0, defaultLimit - ending.length) + ending;
      } else {
        result = text;
      }
    }

    return result;
  },
  beautifyTitle: (words: string) => {
    let result = '';

    if (words) {
      const separateWord = words
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ');

      for (let i = 0; i < separateWord.length; i += 1) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }

      result = separateWord.join(' ');
    }

    return result;
  },
  formatCommaString: (preString: string) => preString.replace(/,\s*$/, ''),
};

export default TextHelper;
