export interface Content {
  _id?: string;
  type?: string;
  files?: any;
  details: Message;
  createdBy?: string;
  createdAt?: string;
}
export interface Message {
  title: string;
  tags: Array<string>;
  message?: string;
  description?: string;
  fileUrl?: string;
  imageUrl?: Array<string>;
  videoUrl?: string;
  location?: any;
  address?: string;
}
export interface File {
  title: string;
  description?: string;
  tags: Array<string>;
  fileUrl?: string;
}
export interface Page {
  title: string;
  tags: Array<string>;
  imageUrl: Array<string>;
  videoUrl: string;
  location: any;
  address?: string;
}
export interface SharePayload {
  contentId: string;
  leadIds: Array<string>;
  performedAt: string;
  contentType: string;
}
