import type { Meteor } from 'meteor/meteor';

export interface User extends Meteor.User {
  username?: string;
  emails?: Array<{ address: string; verified: boolean }>;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: {
      src: string;
      date: Date;
    };
  };
}

export interface BaseDocument {
  _id: string;
  creationDate: Date;
  latestUpdate?: Date;
  host: string;
}

export interface Category {
  categoryId: string;
  label: string;
  color?: string;
}

export interface DocumentFile {
  documentId: string;
  downloadUrl: string;
  label: string;
}

export interface Work extends BaseDocument {
  additionalInfo?: string;
  authorAvatar?: string;
  authorId: string;
  authorUsername: string;
  category?: Category;
  contactInfo?: string;
  documents?: DocumentFile[];
  images?: string[];
  longDescription: string;
  shortDescription?: string;
  showAvatar?: boolean;
  title: string;
}

// Add more domain types as needed during migration
