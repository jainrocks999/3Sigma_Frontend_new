export enum ContentTypeEnum {
  MESSAGE = 'message',
  FILE = 'file',
  PAGE = 'page',
}
export const ContentTypeTagsEnum: any = {
  [ContentTypeEnum.PAGE]: 'pageTags',
  [ContentTypeEnum.FILE]: 'fileTags',
  [ContentTypeEnum.MESSAGE]: 'messageTags',
};
