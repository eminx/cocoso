import type { Meteor } from 'meteor/meteor';

export interface User extends Meteor.User {
  username?: string;
  emails?: Array<{ address: string; verified: boolean }>;
  isSuperAdmin?: boolean;
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

/**
 * MenuItem represents a navigation menu item in the host settings
 */
export interface MenuItem {
  name: string;
  label?: string;
  description?: string;
  isVisible?: boolean;
}

/**
 * Host represents a platform/organization host with its settings
 * Used across entry pages and listing components
 */
export interface Host {
  host?: string;
  name?: string;
  logo?: string;
  color?: string;
  settings?: {
    name?: string;
    menu?: MenuItem[];
  };
}

/**
 * Document represents a generic document attachment
 * Used in Groups, Resources, and Works
 */
export interface Document {
  _id: string;
  name?: string;
}

/**
 * DotsProps for slider dot indicators
 * Used in EmblaSlider and NiceSlider
 */
export interface DotsProps {
  images: string[];
  currentSlideIndex: number;
}

/**
 * SelectedResource for resource selection in forms
 * Used in CalendarActivityForm and PublicActivityForm
 */
export interface SelectedResource {
  _id: string;
  label: string;
  value?: string;
  isCombo?: boolean;
  isBookable?: boolean;
}

/**
 * Message for chat/chattery components
 * Used in Chattery and ChatteryWindow
 */
export interface Message {
  _id?: string;
  content: string;
  createdDate: Date;
  senderUsername: string;
  isSeen?: boolean;
  isFromMe?: boolean;
}

/**
 * MeteorUser for server-side user references
 * Used in mail.methods.ts and aws.slingshot.ts
 */
export interface MeteorUser {
  _id: string;
  username?: string;
  emails?: Array<{ address: string; verified?: boolean }>;
}

/**
 * DateAndTime for activity date/time occurrences in forms
 * Used in DatesAndTimes, CalendarActivityForm, PublicActivityForm
 */
export interface DateAndTime {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  isRange?: boolean;
  conflict?: any;
  isConflictHard?: boolean;
}

/**
 * CategoryItem for category management (with MongoDB _id)
 * Used in CategoriesAdmin and WorkForm
 * Note: Different from Category which uses categoryId for embedded documents
 */
export interface CategoryItem {
  _id: string;
  label: string;
  categoryId?: string;
  color?: string;
}

/**
 * Platform represents the global platform configuration
 * Used in state atoms and platform settings
 */
export interface Platform {
  _id?: string;
  name?: string;
  email?: string;
  portalHost?: string;
  logo?: string;
  isFederationLayout?: boolean;
  footer?: string;
  registrationIntro?: string[];
}

/**
 * PageTitle for page navigation in menus
 * Used in pageTitlesAtom and Header/MenuDrawer components
 */
export interface PageTitle {
  _id: string;
  title: string;
}

/**
 * Role type for user roles in the application
 * Used in roleAtom and permission checks
 */
export type Role = 'admin' | 'contributor' | 'participant' | null;

// Re-export types from shared.ts for convenience
export type {
  Activity,
  Resource,
  ResourceForCombo,
  Booking,
  DateTimeOccurrence,
  Group,
  CategoryLabel,
} from '/imports/api/_utils/shared';
