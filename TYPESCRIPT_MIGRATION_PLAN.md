# TypeScript Migration Plan for Cocoso

> **Migration Order Adjusted**: Methods & Publications moved to Phase 5 (last) per user request for planned refactoring.

## Overview

- **Total Files**: 331 source files
- **JavaScript/JSX**: 295 files (89%)
- **TypeScript/TSX**: 36 files (11%)
- **TypeScript Config**: Already configured with strict mode
- **Framework**: Meteor.js with React 18

---

## Phase 1: UI Components (Low Risk)
**Priority: HIGH | Estimated Files: ~97 .jsx files**

### Strategy
Migrate remaining React components from `.jsx` to `.tsx`. This is the safest phase as UI components are relatively isolated and many have already been migrated.

### Prerequisites
1. Install additional type definitions:
```bash
npm install --save-dev @types/react @types/react-table @types/react-big-calendar @types/react-color @types/react-csv @types/react-helmet @types/react-quill
```

2. Create shared type definitions file:
```typescript
// imports/ui/types.ts
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
```

### Migration Steps

#### Step 1.1: Core UI Components (10 files)
**Risk: Low | Dependencies: Minimal**

Files to migrate:
- `imports/ui/core/Checkbox.jsx` → `.tsx`
- `imports/ui/core/RadioButtons.jsx` → `.tsx`
- `imports/ui/generic/Tag.jsx` → `.tsx`
- `imports/ui/generic/message.jsx` → `.tsx`
- `imports/ui/generic/NiceSlider.jsx` → `.tsx`
- `imports/ui/generic/GenericColorPicker.jsx` → `.tsx`
- `imports/ui/generic/MemberAvatarEtc.jsx` → `.tsx`
- `imports/ui/generic/NewEntryHelper.jsx` → `.tsx`
- `imports/ui/generic/EmblaSlider.jsx` → `.tsx`
- `imports/ui/layout/DummyWrapper.jsx` → `.tsx`

**Migration Pattern Example**:
```typescript
// Before: Checkbox.jsx
import React from 'react';

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

// After: Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
```

#### Step 1.2: Entry Components (9 files)
**Risk: Low | Dependencies: Generic components**

Files to migrate:
- `imports/ui/entry/ActionDates.jsx` → `.tsx`
- `imports/ui/entry/BackLink.jsx` → `.tsx`
- `imports/ui/entry/DeleteEntryHandler.jsx` → `.tsx`
- `imports/ui/entry/FancyDate.jsx` → `.tsx`
- `imports/ui/entry/Terms.jsx` → `.tsx`

#### Step 1.3: Form Components (17 files)
**Risk: Medium | Dependencies: React Hook Form, validation**

Files to migrate:
- `imports/ui/forms/DatesAndTimes.jsx` → `.tsx`
- `imports/ui/forms/EditEntryHandler.jsx` → `.tsx`
- `imports/ui/forms/EntryFormHandler.jsx` → `.tsx`
- `imports/ui/forms/FileDropper.jsx` → `.tsx`
- `imports/ui/forms/NewEntryHandler.jsx` → `.tsx`
- `imports/ui/forms/NewHostForm.jsx` → `.tsx`
- `imports/ui/forms/SuccessRedirector.jsx` → `.tsx`
- `imports/ui/forms/UploadHelpers.jsx` → `.tsx`

**Key Patterns**:
```typescript
// React Hook Form typing
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    // typed data
  };
}
```

#### Step 1.4: Listing Components (9 files)
**Risk: Low | Dependencies: Pagination, filtering**

Files to migrate:
- `imports/ui/listing/FiltrerSorter.jsx` → `.tsx`
- `imports/ui/listing/HostFiltrer.jsx` → `.tsx`
- `imports/ui/listing/InfiniteScroller.jsx` → `.tsx`
- `imports/ui/listing/NewButton.jsx` → `.tsx`
- `imports/ui/listing/NewGridThumb.jsx` → `.tsx`
- `imports/ui/listing/PageHeading.jsx` → `.tsx`
- `imports/ui/listing/Paginate.jsx` → `.tsx`
- `imports/ui/listing/VirtualGridLister.jsx` → `.tsx`

#### Step 1.5: Layout Components (10 files)
**Risk: Medium | Dependencies: Router, i18n**

Files to migrate:
- `imports/ui/layout/ChangeLanguageMenu.jsx` → `.tsx`
- `imports/ui/layout/FeedbackForm.jsx` → `.tsx`
- `imports/ui/layout/Gridder.jsx` → `.tsx`
- `imports/ui/layout/HelmetHybrid.jsx` → `.tsx`
- `imports/ui/layout/MenuDrawer.jsx` → `.tsx`
- `imports/ui/layout/Template.jsx` → `.tsx`
- `imports/ui/layout/TopBarHandler.jsx` → `.tsx`
- `imports/ui/layout/UserPopup.jsx` → `.tsx`

#### Step 1.6: Page Components (42 files)
**Risk: Medium-High | Dependencies: All above components**

Groups:
- **Admin pages** (13 files): `imports/ui/pages/admin/**/*.jsx`
- **Auth pages** (1 file): `imports/ui/pages/auth/SignupPage.jsx`
- **Activity pages** (3 files): `imports/ui/pages/activities/*.jsx`
- **Calendar pages** (1 file): `imports/ui/pages/calendar/*.jsx`
- **Composable pages** (8 files): `imports/ui/pages/composablepages/**/*.jsx`
- **Groups pages** (8 files): `imports/ui/pages/groups/**/*.jsx`
- **Hosts pages** (2 files): `imports/ui/pages/hosts/*.jsx`
- **Pages management** (4 files): `imports/ui/pages/pages/**/*.jsx`
- **Profile pages** (7 files): `imports/ui/pages/profile/**/*.jsx`
- **Resources pages** (3 files): `imports/ui/pages/resources/**/*.jsx`
- **Works pages** (3 files): `imports/ui/pages/works/**/*.jsx`

#### Step 1.7: Chattery Components (2 files)
**Risk: Low | Dependencies: Chat context**

Files to migrate:
- `imports/ui/chattery/ChatteryBubble.jsx` → `.tsx`
- `imports/ui/chattery/ChatteryInput.jsx` → `.tsx`

### Testing Strategy
- After each sub-step, run: `npm run lint` to check for TypeScript errors
- Test affected pages manually in the browser
- Ensure no runtime errors in console
- Verify all imports resolve correctly

### Success Criteria
- ✅ All `.jsx` files in `imports/ui/` converted to `.tsx`
- ✅ No TypeScript compilation errors
- ✅ All components render correctly
- ✅ Props are properly typed
- ✅ Event handlers have correct types

---

## Phase 2: Utilities & Helpers (Medium Risk)
**Priority: HIGH | Estimated Files: ~20 .js files**

### Strategy
Migrate utility functions, helpers, and shared code. These are used across the application, so careful typing is critical.

**IMPORTANT**: Keep SimpleSchema utilities for MongoDB collections. Add Zod schemas for method/form validation.

### Prerequisites
1. Create utility type definitions:
```typescript
// imports/api/_utils/types.ts
export interface MailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export interface AWSConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
```

### Migration Steps

#### Step 2.1: Schema Utilities (2 files)
**Risk: MEDIUM | Impact: Database models**

Files to migrate:
- `imports/api/_utils/schemas.js` → `.ts`
- `imports/api/_utils/shared.js` → `.ts`

**KEEP SimpleSchema + ADD Zod Pattern**:
```typescript
// schemas.ts - HYBRID APPROACH
import SimpleSchema from 'simpl-schema';
import { z } from 'zod';

// KEEP SimpleSchema - for MongoDB collection validation
export const Schemas = {
  Id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  Hostname: {
    type: String,
    regEx: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/,
  },
  Email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  Src: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  Avatar: {
    src: { type: String },
    date: { type: Date },
  },
};

// ADD Zod schemas - for method inputs and TypeScript types
export const ZodSchemas = {
  Id: z.string().regex(/^[a-zA-Z0-9]{17}$/, 'Invalid ID format'),
  Hostname: z.string().regex(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/, 'Invalid hostname'),
  Email: z.string().email().optional(),
  Src: z.string().url(),
  Avatar: z.object({
    src: z.string(),
    date: z.date(),
  }),
};

// Type exports from Zod
export type Avatar = z.infer<typeof ZodSchemas.Avatar>;

// Re-export for backwards compatibility
export { SimpleSchema };
```

#### Step 2.2: Mail Services (3 files)
**Risk: Medium | Dependencies: Email templates, SMTP**

Files to migrate:
- `imports/api/_utils/services/mails/mail.helpers.js` → `.ts`
- `imports/api/_utils/services/mails/mail.smtp.js` → `.ts`
- `imports/api/_utils/services/mails/templates.mails.js` → `.ts`

**Typing Pattern**:
```typescript
// mail.helpers.ts
interface MailTemplate {
  subject: string;
  html: string;
}

interface MailContext {
  username: string;
  url?: string;
  [key: string]: any;
}

export function generateMail(template: string, context: MailContext): MailTemplate {
  // implementation
}
```

#### Step 2.3: AWS/Slingshot Service (1 file)
**Risk: Medium | Dependencies: File uploads**

Files to migrate:
- `imports/api/_utils/services/aws.slingshot.js` → `.ts`

**Typing Pattern**:
```typescript
// aws.slingshot.ts
import { Slingshot } from 'meteor/edgee:slingshot';

interface SlingshotDirective {
  bucket: string;
  acl: string;
  authorize(): boolean;
  key(file: File): string;
}

export function configureUpload(name: string, config: SlingshotDirective): void {
  Slingshot.createDirective(name, Slingshot.S3Storage, config);
}
```

### Testing Strategy
- Unit test each utility function after migration
- Verify imports in dependent files
- Test mail sending functionality
- Test file upload functionality
- Run `npm run lint`

### Success Criteria
- ✅ All utility files in `imports/api/_utils/` converted to `.ts`
- ✅ Zod schemas created for validation
- ✅ No TypeScript errors
- ✅ All utility functions maintain same behavior
- ✅ Type exports available for use in other phases

---

## Phase 3: Data Models (High Risk)
**Priority: MEDIUM | Estimated Files: ~50 .js files**

### Strategy
Migrate Mongo collection definitions and model files. This phase replaces SimpleSchema with Zod for better TypeScript integration.

### Prerequisites
1. Install Meteor type definitions:
```bash
npm install --save-dev @types/meteor
```

2. Create base model types:
```typescript
// imports/api/types/base.ts
export interface BaseModel {
  _id: string;
  creationDate: Date;
  latestUpdate?: Date;
}

export interface HostedModel extends BaseModel {
  host: string;
}

export interface AuthoredModel extends HostedModel {
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
}
```

### Migration Steps

#### Step 3.1: Works Model (1 file)
**Risk: MEDIUM | Dependencies: Categories, Documents**

File to migrate:
- `imports/api/works/work.js` → `.ts`

**Migration Pattern - KEEP SimpleSchema for Collections**:
```typescript
// Before: work.js
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Works = new Mongo.Collection('works');

Works.schema = new SimpleSchema({
  _id: Schemas.Id,
  title: { type: String },
  // ... rest
});

Works.attachSchema(Works.schema);

export default Works;

// After: work.ts - HYBRID APPROACH
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { z } from 'zod';
import { Schemas, ZodSchemas } from '../_utils/schemas';

// TypeScript interface for the document
export interface WorkDocument {
  _id: string;
  title: string;
  shortDescription?: string;
  longDescription: string;
  additionalInfo?: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  category?: {
    categoryId: string;
    label: string;
    color?: string;
  };
  contactInfo?: string;
  creationDate: Date;
  documents?: Array<{
    documentId: string;
    downloadUrl: string;
    label: string;
  }>;
  host: string;
  images?: string[];
  latestUpdate?: Date;
  showAvatar?: boolean;
}

// KEEP SimpleSchema for collection validation
const WorkSimpleSchema = new SimpleSchema({
  _id: Schemas.Id,
  additionalInfo: { type: String, defaultValue: '', optional: true },
  authorAvatar: { type: String, optional: true },
  authorId: Schemas.Id,
  authorUsername: { type: String },
  category: { type: Object, optional: true },
  'category.categoryId': { type: Schemas.Id },
  'category.label': { type: String },
  'category.color': { type: String, optional: true },
  contactInfo: { type: String, optional: true },
  creationDate: { type: Date },
  documents: { type: Array, optional: true, defaultValue: [] },
  'documents.$': {
    type: new SimpleSchema({
      documentId: { type: String },
      downloadUrl: { type: String },
      label: { type: String },
    }),
    optional: true,
  },
  host: Schemas.Hostname,
  images: { type: Array, optional: true },
  'images.$': { type: String },
  latestUpdate: { type: Date, optional: true },
  longDescription: { type: String, defaultValue: '' },
  shortDescription: { type: String, defaultValue: '', optional: true },
  showAvatar: { type: Boolean, defaultValue: true, optional: true },
  title: { type: String },
});

// ADD Zod schema for method inputs (creating/updating works)
export const CreateWorkInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().optional(),
  longDescription: z.string().default(''),
  additionalInfo: z.string().optional(),
  category: z.object({
    categoryId: ZodSchemas.Id,
    label: z.string(),
    color: z.string().optional(),
  }).optional(),
  contactInfo: z.string().optional(),
  documents: z.array(z.object({
    documentId: z.string(),
    downloadUrl: z.string(),
    label: z.string(),
  })).optional(),
  images: z.array(z.string()).optional(),
  showAvatar: z.boolean().optional(),
});

export type CreateWorkInput = z.infer<typeof CreateWorkInputSchema>;

// Typed Mongo collection
const Works = new Mongo.Collection<WorkDocument>('works');

// Attach SimpleSchema for automatic validation
Works.attachSchema(WorkSimpleSchema);

export default Works;
```

#### Step 3.2: Other Models (Follow same pattern)
Migrate in order of dependencies:

**Group A: Independent Models** (5 files)
- `imports/api/keywords/keyword.js` → `.ts`
- `imports/api/platform/platform.js` → `.ts`
- `imports/api/hosts/host.js` → `.ts`
- `imports/api/categories/category.js` → `.ts` (if exists)
- `imports/api/newsletters/newsletter.js` → `.ts`

**Group B: User-dependent Models** (1 file)
- `imports/api/users/user.js` → `.ts`

**Group C: Content Models** (7 files)
- `imports/api/activities/activity.js` → `.ts`
- `imports/api/resources/resource.js` → `.ts`
- `imports/api/pages/page.js` → `.ts`
- `imports/api/documents/document.js` → `.ts`
- `imports/api/groups/group.js` → `.ts`
- `imports/api/chats/chat.js` → `.ts`
- `imports/api/composablepages/composablepage.js` → `.ts`

#### Step 3.3: Helper Files (8 files)
**Risk: Medium | Dependencies: Models**

Files to migrate:
- `imports/api/activities/activity.helpers.js` → `.ts`
- `imports/api/groups/group.helpers.js` → `.ts`
- `imports/api/composablepages/composablepage.helpers.js` → `.ts`
- `imports/api/users/user.roles.js` → `.ts`
- `imports/api/users/user.admin.js` → `.ts`

#### Step 3.4: Mail-related Files (4 files)
**Risk: Low | Dependencies: Mail utilities from Phase 2**

Files to migrate:
- `imports/api/activities/activity.mails.js` → `.ts`
- `imports/api/activities/mailtranslations.js` → `.ts`
- `imports/api/groups/group.mails.js` → `.ts`
- `imports/api/groups/mailtranslations.js` → `.ts`

### Testing Strategy
- After each model migration:
  - Test CRUD operations in Meteor shell
  - Verify Zod validation works correctly
  - Test dependent code still works
  - Check database operations complete successfully
- Run integration tests if available
- Manually test features using each model

### Success Criteria
- ✅ All model files converted to `.ts`
- ✅ Zod schemas replace SimpleSchema
- ✅ Type-safe collections created
- ✅ All CRUD operations work correctly
- ✅ Validation works as expected
- ✅ No runtime errors in database operations

---

## Phase 4: Server & Startup (High Risk)
**Priority: MEDIUM | Estimated Files: ~8 .js files**

### Strategy
Migrate server entry points, startup code, and configuration files. This affects application initialization and server-side logic.

### Prerequisites
1. Ensure all previous phases completed successfully
2. Create server type definitions:
```typescript
// server/types.ts
import type { Meteor } from 'meteor/meteor';

export interface ServerSettings {
  smtp?: {
    username: string;
    password: string;
    server: string;
    port: number;
  };
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  public?: {
    appName: string;
  };
}

declare module 'meteor/meteor' {
  namespace Meteor {
    function settings: ServerSettings;
  }
}
```

### Migration Steps

#### Step 4.1: Constants (1 file)
**Risk: Low | Dependencies: None**

File to migrate:
- `imports/startup/constants.js` → `.ts`

**Pattern**:
```typescript
// Before: constants.js
export const defaultCategories = [
  { label: 'Art', color: 'blue' },
];

// After: constants.ts
export interface Category {
  label: string;
  color: string;
}

export const defaultCategories: readonly Category[] = [
  { label: 'Art', color: 'blue' },
] as const;
```

#### Step 4.2: i18n Configuration (1 file)
**Risk: Medium | Dependencies: i18next**

File to migrate:
- `imports/startup/i18n.js` → `.ts`

**Pattern**:
```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

interface I18nConfig {
  lng: string;
  fallbackLng: string;
  resources: Record<string, any>;
}

const config: I18nConfig = {
  lng: 'en',
  fallbackLng: 'en',
  resources: {},
};

i18n.use(initReactI18next).init(config);

export default i18n;
```

#### Step 4.3: Server Startup Files (3 files)
**Risk: HIGH | Impact: Server initialization**

Files to migrate:
- `imports/startup/server/api.js` → `.ts`
- `imports/startup/server/migrations.js` → `.ts`
- `imports/startup/server/serverRenderer.js` → `.tsx`
- `imports/startup/server/index.js` → `.ts`

**Pattern for api.ts**:
```typescript
// api.ts - Import all server-side code
import '../api/users/user.methods';
import '../api/users/user.publications';
import '../api/works/work.methods';
import '../api/works/work.publications';
// ... more imports

// Type-safe Meteor settings access
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  const settings = Meteor.settings as ServerSettings;
  // Use settings with type safety
}
```

**Pattern for migrations.ts**:
```typescript
// migrations.ts
import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

interface Migration {
  version: number;
  name: string;
  up: () => void;
  down?: () => void;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'Add default categories',
    up() {
      // migration logic
    },
  },
];

if (Meteor.isServer) {
  migrations.forEach((migration) => {
    Migrations.add(migration);
  });
}
```

#### Step 4.4: Entry Points (2 files)
**Risk: CRITICAL | Impact: Application startup**

Files to migrate:
- `server/main.js` → `.ts`
- `client/main.js` → `.ts` (or `.tsx` if has JSX)

**Pattern for server/main.ts**:
```typescript
// server/main.ts
import { Meteor } from 'meteor/meteor';
import '../imports/startup/server';

Meteor.startup(() => {
  console.log('Server started');
  // Type-safe startup logic
});
```

**Pattern for client/main.tsx**:
```typescript
// client/main.tsx
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../imports/ui/App';

Meteor.startup(() => {
  const container = document.getElementById('react-root');
  if (!container) throw new Error('Root element not found');

  const root = createRoot(container);
  root.render(<App />);
});
```

### Testing Strategy
- **CRITICAL**: Test in development environment first
- Verify server starts without errors
- Check all publications load correctly
- Verify methods are callable
- Test client connection to server
- Check migration execution
- Verify i18n loads correctly

### Success Criteria
- ✅ Server starts successfully
- ✅ Client connects to server
- ✅ All startup code executes without errors
- ✅ Migrations run correctly
- ✅ Settings are type-safe
- ✅ No runtime errors during initialization

---

## Phase 5: Methods & Publications - REFACTOR LAST (Highest Risk)
**Priority: LOW | Estimated Files: ~30 .js files**

### Strategy
**NOTE**: User plans to refactor these files, so migration can happen during or after refactoring. This phase provides guidance for when you're ready.

### Files to Migrate

#### Publications (10 files)
- `imports/api/activities/activity.publications.js` → `.ts`
- `imports/api/chats/chat.publications.js` → `.ts`
- `imports/api/documents/document.publications.js` → `.ts`
- `imports/api/groups/group.publications.js` → `.ts`
- `imports/api/hosts/host.publications.js` → `.ts`
- `imports/api/pages/page.publications.js` → `.ts`
- `imports/api/resources/resource.publications.js` → `.ts`
- `imports/api/users/user.publications.js` → `.ts`
- `imports/api/works/work.publications.js` → `.ts`

#### Methods (12 files)
- `imports/api/activities/activity.methods.js` → `.ts`
- `imports/api/chats/chat.methods.js` → `.ts`
- `imports/api/composablepages/composablepage.methods.js` → `.ts`
- `imports/api/documents/document.methods.js` → `.ts`
- `imports/api/groups/group.methods.js` → `.ts`
- `imports/api/hosts/host.methods.js` → `.ts`
- `imports/api/keywords/keywords.methods.js` → `.ts`
- `imports/api/newsletters/newsletter.methods.js` → `.ts`
- `imports/api/pages/page.methods.js` → `.ts`
- `imports/api/platform/platform.methods.js` → `.ts`
- `imports/api/resources/resource.methods.js` → `.ts`
- `imports/api/users/user.methods.js` → `.ts`
- `imports/api/works/work.methods.js` → `.ts`

### Modern Approach: Type-Safe Meteor Methods

Consider using modern patterns during refactoring:

```typescript
// Modern pattern with Zod validation and full type safety
import { Meteor } from 'meteor/meteor';
import { z } from 'zod';
import Works, { WorkSchema } from './work';

// Define method input schema
const CreateWorkSchema = WorkSchema.omit({ _id: true, creationDate: true });

type CreateWorkInput = z.infer<typeof CreateWorkSchema>;

// Type-safe method definition
export const createWork = (input: CreateWorkInput): string => {
  // Validate input
  const validated = CreateWorkSchema.parse(input);

  // Authorization
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }

  // Business logic
  const workDoc = {
    ...validated,
    authorId: Meteor.userId()!,
    creationDate: new Date(),
  };

  return Works.insert(workDoc);
};

// Register method
Meteor.methods({
  'works.create': createWork,
});

// Client-side typed call
declare module 'meteor/meteor' {
  namespace Meteor {
    function call(
      name: 'works.create',
      input: CreateWorkInput,
      callback?: (error?: Error, result?: string) => void
    ): string;
  }
}
```

### Modern Approach: Type-Safe Publications

```typescript
// Type-safe publication pattern
import { Meteor } from 'meteor/meteor';
import Works, { WorkDocument } from './work';

interface WorksPublicationArgs {
  limit?: number;
  host?: string;
}

Meteor.publish('works.list', function(args: WorksPublicationArgs = {}) {
  const { limit = 10, host } = args;

  // Authorization check
  if (!this.userId) {
    return this.ready();
  }

  // Build query
  const query: Mongo.Selector<WorkDocument> = {};
  if (host) {
    query.host = host;
  }

  return Works.find(query, { limit, sort: { creationDate: -1 } });
});

// Client-side typed subscription
declare module 'meteor/meteor' {
  namespace Meteor {
    function subscribe(
      name: 'works.list',
      args?: WorksPublicationArgs
    ): Meteor.SubscriptionHandle;
  }
}
```

### Recommendation for Refactoring

When you refactor methods/publications, consider:

1. **Consolidate related methods** into service classes
2. **Use Zod for validation** instead of manual checks
3. **Create typed client stubs** for autocomplete and type safety
4. **Separate authorization logic** into reusable functions
5. **Add comprehensive error handling** with typed errors

### Success Criteria (When Ready)
- ✅ All methods converted to `.ts`
- ✅ All publications converted to `.ts`
- ✅ Zod validation for all method inputs
- ✅ Type-safe method calls from client
- ✅ Type-safe publication subscriptions
- ✅ Proper authorization checks
- ✅ No runtime errors

---

## Type Consolidation (Completed)

As part of the migration, duplicate and inconsistent type definitions across the codebase were consolidated into `/imports/ui/types.ts`. This ensures a single source of truth for shared types.

### Consolidated Types in `/imports/ui/types.ts`

| Type | Used In | Notes |
|------|---------|-------|
| `User` | User-related components | Extends `Meteor.User` |
| `BaseDocument` | All document types | Base for MongoDB documents |
| `Category` | Works, embedded categories | Uses `categoryId` for embedded docs |
| `DocumentFile` | Works, Groups | File attachments |
| `Work` | Work-related components | Extends `BaseDocument` |
| `MenuItem` | Host settings, navigation | Menu configuration |
| `Host` | Entry pages, listing components | Platform/organization host |
| `Document` | Groups, Resources, Works | Generic document attachment |
| `DotsProps` | `EmblaSlider`, `NiceSlider` | Slider dot indicators |
| `SelectedResource` | `CalendarActivityForm`, `PublicActivityForm` | Resource selection in forms |
| `Message` | `Chattery`, `ChatteryWindow` | Chat messages |
| `MeteorUser` | `mail.methods.ts`, `aws.slingshot.ts` | Server-side user references |
| `DateAndTime` | `DatesAndTimes`, `CalendarActivityForm`, `PublicActivityForm` | Activity date/time occurrences |
| `CategoryItem` | `CategoriesAdmin`, `WorkForm` | MongoDB category documents (with `_id`) |

### Re-exported Types from `/imports/api/_utils/shared.ts`

These types are re-exported from `types.ts` for convenience:
- `Activity`, `Resource`, `ResourceForCombo`, `Booking`, `DateTimeOccurrence`, `Group`, `CategoryLabel`

### Why This Won't Break the App

1. **Same type shapes** - All consolidated types maintain the same properties as the original local definitions. Extended properties are made optional where needed.

2. **Re-exports maintained** - Files like `DatesAndTimes.tsx` still re-export types for backward compatibility with existing imports.

3. **Backward compatible** - The shared types are supersets of the original local types:
   - `DateAndTime` includes both `attendees` (from PublicActivityForm) and `isConflictHard` (from CalendarActivityForm)
   - `CategoryItem` includes both `_id`/`label` (from CategoriesAdmin) and optional `categoryId`/`color` (from WorkForm)
   - `MeteorUser` includes `emails` array (from mail.methods) while aws.slingshot only used `username`

4. **Import paths work** - Meteor resolves `/imports/...` paths correctly, so both UI and API files can import from `/imports/ui/types`.

### Files Updated to Use Shared Types

**UI Components:**
- `imports/ui/chattery/ChatteryWindow.tsx` - `Message`
- `imports/ui/chattery/Chattery.tsx` - `Message`
- `imports/ui/generic/EmblaSlider.tsx` - `DotsProps`
- `imports/ui/generic/NiceSlider.tsx` - `DotsProps`
- `imports/ui/listing/HostFiltrer.tsx` - `Host`
- `imports/ui/entry/GroupHybrid.tsx` - `Host`
- `imports/ui/entry/ResourceHybrid.tsx` - `Host`
- `imports/ui/entry/WorkHybrid.tsx` - `Host`
- `imports/ui/entry/ActivityHybrid.tsx` - `Host`
- `imports/ui/entry/UserHybrid.tsx` - `Host`
- `imports/ui/entry/ComposablePageHybrid.tsx` - `Host`
- `imports/ui/listing/PageHeading.tsx` - `Host`

**Form Components:**
- `imports/ui/forms/DatesAndTimes.tsx` - `DateAndTime` (re-exports)
- `imports/ui/pages/calendar/CalendarActivityForm.tsx` - `SelectedResource`, `DateAndTime`
- `imports/ui/pages/activities/PublicActivityForm.tsx` - `SelectedResource`, `DateAndTime`
- `imports/ui/pages/admin/CategoriesAdmin.tsx` - `CategoryItem`
- `imports/ui/pages/works/WorkForm.tsx` - `CategoryItem`

**API/Server Files:**
- `imports/api/_utils/services/mails/mail.methods.ts` - `MeteorUser`
- `imports/api/_utils/services/aws.slingshot.ts` - `MeteorUser`

---

## Post-Migration Tasks

### 1. Update tsconfig.json
Once migration is complete, tighten TypeScript settings:

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "esNext",
    "lib": ["esnext", "dom"],
    "allowJs": false,  // ← Changed from true
    "checkJs": false,
    "jsx": "preserve",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,  // ← Changed from false
    "noFallthroughCasesInSwitch": true,  // ← Changed from false
    "jsxImportSource": "react",
    "resolveJsonModule": true,
    "types": ["meteor-typings", "node"],  // ← Added types
    "esModuleInterop": true,
    "preserveSymlinks": true,
    "skipLibCheck": false  // ← Added (check all d.ts files)
  },
  "exclude": ["./.meteor/**", "./packages/**", "./node_modules/**"]
}
```

### 2. Keep SimpleSchema for Collections
**Do NOT remove SimpleSchema** - it's essential for Meteor collection validation:
- SimpleSchema stays for `attachSchema()` on collections
- Zod is used for method inputs and form validation
- Both libraries work together

### 3. Update package.json Scripts
Add TypeScript checking to your workflow:
```json
{
  "scripts": {
    "start": "meteor run --settings private/settings.json",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts --ext .tsx",
    "test": "npm run type-check && meteor test --driver-package meteortesting:mocha"
  }
}
```

### 4. Create Migration Documentation
Document any breaking changes, new patterns, and migration learnings in:
- `MIGRATION_NOTES.md` - What changed and why
- `TYPESCRIPT_PATTERNS.md` - Established patterns for new code
- Update `README.md` with TypeScript info

### 5. Set Up CI/CD Type Checking
Add to your CI pipeline:
```yaml
# Example GitHub Actions
- name: Type Check
  run: npm run type-check
```

---

## Common Patterns & Best Practices

### 1. Meteor Method Typing
```typescript
// Define method with Zod validation
import { z } from 'zod';

const UpdateWorkSchema = z.object({
  workId: z.string(),
  updates: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

type UpdateWorkInput = z.infer<typeof UpdateWorkSchema>;

export const updateWork = (input: UpdateWorkInput): number => {
  const validated = UpdateWorkSchema.parse(input);
  // ... method logic
  return Works.update(validated.workId, { $set: validated.updates });
};

Meteor.methods({
  'works.update': updateWork,
});
```

### 2. React Component Props
```typescript
// Always define prop interfaces
interface WorkCardProps {
  work: Work;
  onClick?: (workId: string) => void;
  showAuthor?: boolean;
}

export default function WorkCard({
  work,
  onClick,
  showAuthor = true
}: WorkCardProps) {
  // Component logic
}
```

### 3. Meteor Subscription Hooks
```typescript
// Type-safe subscription hook
import { useTracker } from 'meteor/react-meteor-data';
import Works, { Work } from '../api/works/work';

interface UseWorksOptions {
  limit?: number;
  host?: string;
}

export function useWorks(options: UseWorksOptions = {}) {
  return useTracker(() => {
    const handle = Meteor.subscribe('works.list', options);

    return {
      loading: !handle.ready(),
      works: Works.find({}, {
        limit: options.limit || 10,
        sort: { creationDate: -1 }
      }).fetch() as Work[],
    };
  }, [options.limit, options.host]);
}
```

### 4. Event Handlers
```typescript
// Type React event handlers properly
import React from 'react';

function MyComponent() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // ...
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // ...
  };

  return (
    <>
      <button onClick={handleClick}>Click</button>
      <input onChange={handleChange} />
    </>
  );
}
```

### 5. Mongo Queries
```typescript
// Type Mongo selectors and modifiers
import { Mongo } from 'meteor/mongo';

const selector: Mongo.Selector<WorkDocument> = {
  host: 'example.com',
  'category.label': 'Art',
};

const modifier: Mongo.Modifier<WorkDocument> = {
  $set: {
    title: 'New Title',
    latestUpdate: new Date(),
  },
  $push: {
    images: 'new-image-url.jpg',
  },
};

Works.update(selector, modifier);
```

---

## Risk Mitigation Strategies

### 1. Version Control Discipline
- Create feature branch: `git checkout -b typescript-migration`
- Commit after each sub-phase completion
- Tag stable points: `git tag phase-1-complete`
- Never commit broken code

### 2. Incremental Testing
- Test after every file migration
- Run linter continuously: `npm run lint -- --watch`
- Keep development server running to catch runtime errors
- Test in staging environment before production

### 3. Rollback Plan
- Keep detailed migration log
- Document any breaking changes
- Maintain ability to rollback to previous phase
- Keep `allowJs: true` until fully complete

### 4. Communication
- Inform team before starting each phase
- Document breaking changes immediately
- Share TypeScript patterns as they're established
- Regular progress updates

---

## Timeline Estimates

**Note**: These are rough estimates. Actual time depends on codebase familiarity and complexity discovered during migration.

- **Phase 1** (UI Components): 2-3 weeks
  - Core components: 2-3 days
  - Entry components: 2 days
  - Form components: 3-4 days
  - Listing components: 2 days
  - Layout components: 2-3 days
  - Page components: 5-7 days
  - Testing/fixes: 2-3 days

- **Phase 2** (Utilities): 1 week
  - Schema migration: 2-3 days
  - Services migration: 2-3 days
  - Testing: 1-2 days

- **Phase 3** (Data Models): 2-3 weeks
  - Model migrations: 7-10 days
  - Helper migrations: 3-4 days
  - Testing/validation: 3-4 days

- **Phase 4** (Server & Startup): 1 week
  - Startup files: 2-3 days
  - Entry points: 1-2 days
  - Testing: 2-3 days

- **Phase 5** (Methods & Publications): 2-3 weeks (or during refactoring)
  - Method migrations: 5-7 days
  - Publication migrations: 3-4 days
  - Client-side types: 2-3 days
  - Testing: 3-4 days

**Total Estimated Duration**: 8-11 weeks for complete migration

---

## Success Metrics

Track these metrics throughout migration:

- **TypeScript Coverage**: `(TS files / Total files) * 100`
  - Start: 11%
  - Target: 100%

- **Type Errors**: `tsc --noEmit`
  - Target: 0 errors

- **ESLint Errors**: `npm run lint`
  - Target: 0 errors

- **Runtime Errors**: Monitor console logs
  - Target: 0 new errors from migration

- **Test Coverage**: If tests exist
  - Target: Maintain or improve coverage

---

## Questions & Decisions

### Decisions Made
- ✅ Migrate UI components first (safest, visible progress)
- ✅ Use Zod for validation instead of SimpleSchema
- ✅ Methods/Publications last (pending refactor)
- ✅ Keep `allowJs: true` during migration
- ✅ Create shared type definitions early

### Open Questions
1. ✅ **RESOLVED**: Keep SimpleSchema for collections, use Zod for methods/forms (hybrid approach)
2. Should we create a custom Meteor method/publication typing library for reuse?
3. Any specific components or features that are higher priority?
4. What's the testing strategy - manual only or do you have automated tests?

---

## Additional Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev/)
- [Meteor TypeScript Guide](https://guide.meteor.com/build-tool.html#typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tools
- TypeScript Playground: Test type definitions
- Zod Playground: Test schema validations
- VS Code Extensions: ESLint, Prettier, TypeScript

---

**Next Steps**: Review this plan, ask questions, then proceed with Phase 1 when ready!
