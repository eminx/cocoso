# Community Cooperation Software

![Cocoso logo](https://www.cocoso.info/cocoso-logo.png)

[![Version](https://img.shields.io/badge/version-3.1.npm2-blue.svg)](https://github.com/eminx/cocoso/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Meteor](https://img.shields.io/badge/Meteor-3.x-DE4F4F?logo=meteor&logoColor=white)](https://www.meteor.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/eminx/cocoso/pulls)
[![GitHub stars](https://img.shields.io/github/stars/eminx/cocoso?style=social)](https://github.com/eminx/cocoso)
[![GitHub issues](https://img.shields.io/github/issues/eminx/cocoso)](https://github.com/eminx/cocoso/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/eminx/cocoso)](https://github.com/eminx/cocoso/commits)

[https://cocoso.info/](https://www.cocoso.info/)

## Intro

Cocoso is a web-based software that runs as a webapp on browsers. You can use it to build and facilitate your web presence; but also a platform for having users follow, participate and contribute to your activities. Whether it's for a festival, an association, non-profit, family, small or medium business, alternative school, yoga space, or a revolutionary artists collective, Cocoso will probably work for you very well.

It is built for the primary purpose of helping an open community of people cooperate with each other _better_, whether they are locally engaged with one another or cooperate remotely. It does so by featuring different digital tools for enabling individuals to timely utilise a set of common material resources as well as human.

It isn't a profit-oriented project, and is fully open source and free. There's been strong artistic, social and economic motives behind building it. Currently we are working with different community building and maintaining projects such as autonomous communities using alternative currencies as well as creating a platform for artists and artist run initiatives.

We're proud to say that Cocoso is completely free of any surveillance tools. Because freeing of users from surveillance by the Big Tech has probably been the most fundamental motive behind building Cocoso.

With Cocoso, you own your own data, at the individual and organisation level. You basically run your community on your own terms.

## Features

### User Accounts

Every user can easily create an account and continue their operations from there. This is built on top of Meteor's account system, which has proven to work very powerful.

Accounts feature can easily be extended to have further information for each user such as an avatar, phone number, account number etc. Passwords are automatically encrypted in the database so system admins won't be able to track them.

The way accounts work for the multi tenancy feature in Cocoso is each account is global, but can have different privileges in different spaces. This allows users to have relation to each other in between spaces while keeping their privileges only in their own spaces. It is designed for autonomy in mind.

### Public Activities (Events)

Since Cocoso is primarily built for an artist run space that continuously hosts public stage performances for a limited audience who are required to register beforehand; creating and managing a public event was the number one requirement.

There are a few components of public events that can be listed as below:

- **Create/edit/delete content** with an image, title, description and further info; as well as a set of occurrences with optionally multiple dates (and times). By this way, admins do not need to create new entry for all occurrences
- **RSVP registration:** People can easily register and receive an email with confirmation
- **RSVP verification** : Admins can easily see who has signed up for each event under relevant occurrence section to verify attendees registration on arrival
- **Auto-sync with Calendar**: Each occurrence automatically populates in the calendar as well (see below)

### Shared Resources

It is possible to _list_ (by admins) a set of shared resources for them to be timely _claimed/booked_ by verified users. Every each booking is automatically displayed on the calendar. This is very similar to the widespread usage of Google & Outlook calendars in typical shared resource contexts like in a e.g. company office.

However, with Cocoso, the way this works is much more simplified. You make a booking and that's it. It's so far not possible to make calendar invites etc, because we think those become unnecessary automations turning working people into robots feeding machines and become dictated about how the digital systems work rather than digital systems helping people proceed in their workflows. We like to think that people talk to each other more in work places rather than work around tools to prevent that.

Resource Sharing and Calendar work with one another very tightly. Indeed Calendar is the visual language enabling Resource Sharing, as well as what's happening in the community.

### Calendar

The calendar is shown with _Month_ (default), _Week_, _Day_ and _Agenda_ views using [React Big Calendar](https://github.com/jquense/react-big-calendar). One can navigate to previous or next month/week/day with a click. It's just like the calendar app you're using but embedded on a webpage.

Each entry in calendar could be assigned a different category such as a _resource_ booked or a type of activity such as _yoga_. It'd be useful for both presenting different kinds of entries as well different kinds of bookings. Like every each feature in Cocoso, intentionally made very abstract so that it can be applied to different use cases.

### Groups

A group is a concept and a series of virtual or actual activities by a group of individuals to facilitate a _purposeful conceptual activity_ together and keep track of relevant information such as meeting date&time occurrences, documents, members, discussions etc.

Maybe this explanation was too abstract?

This feature basically includes most of the digital tools for running, for example a learning, training, cocreation or facilitation group. Like a school, or a continuous/recurrent yoga session, or a cooperative activity of any kind.

You can basically keep your main information (image and text), members list, a simple discussion forum, documents, and meeting dates all in one page.

All in one page.

### Members

If you're admin of an organisation, you can find and filter through members of the organisation. You can verify or unverify them for being able to do certain activities such as creating activities in the program/calendar or creating a group. Think of it like if you run a yoga studio, you'll have both your teachers and students in one platform. Then you will verify your teachers for them to be able to create their activities at the home page, whereas students can only participate to existing activities.

So necessarily privileges can be meaningfully distributed amongst your community.

### Works

A work is what an artist, researcher, designer, craftsperson or a reseller showcases their work with. _A Work_ consists of text (title, description, further info etc), images, sound and/or video, categorised in whichever way they like. Its basically a special entry specifically bound to its creator. It is perfect for portfolio use case as well as marketplace.

One can also create a work and save it privately for internal use and documentation. The primary purpose it is built for is to enable artists and craftspeople to publish and communicate what they do with the rest of the world.

Images to be uploaded are automatically resized on the client browser before they are uploaded to AWS S3 buckets.

### Info / Static Pages

This is a very simple page, basically. The simplest CMS you could ever think of...

With this feature one can easily create a page only with a _title_ and a _description_ (with rich text editing). Title becomes the slug with a little modification like `About Us` becoming `/page/about-us` and that's pretty much it. Each page is automatically added to navigation as just another static page.

## Technology

### Main Framework

Cocoso is built using [Meteor.js](https://www.meteor.com/), a full-stack JavaScript framework built on top of Node.js. Meteor is an open source and free development framework that has been actively maintained for over a decade. It works with MongoDB by default and provides first-class support for it on top of the DDP protocol, featuring reactive programming with WebSockets out of the box. Using Meteor, it is also relatively easy to create native apps via built-in Cordova support.

### Database

Cocoso uses MongoDB as its database, with Meteor providing first-class support for it. User accounts are powered by Meteor's built-in accounts modules and stored in a dedicated collection. Passwords are always stored encrypted so system admins cannot view them.

### User Interface

The UI is built with **React 18** as the primary frontend framework. A custom component library is built using:

- **[Stitches](https://stitches.dev/)** - CSS-in-JS library for styling with a utility-first approach
- **[Ant Design](https://ant.design/)** - For complex UI components (tables, forms, etc.)
- **[Lucide React](https://lucide.dev/)** - Icon library

### State Management

**[Jotai](https://jotai.org/)** is used for atomic state management, providing a minimal and flexible approach to global state.

### Routing

**[React Router 7](https://reactrouter.com/)** handles client-side routing with support for data loading and nested routes.

### Forms

Forms are managed with **[React Hook Form](https://react-hook-form.com/)** combined with **[Zod](https://zod.dev/)** for schema validation.

### Internationalization

**[i18next](https://www.i18next.com/)** with **react-i18next** provides full internationalization support with browser language detection.

### Rich Text Editing

**[React Quill](https://github.com/zenoamaro/react-quill)** is used for rich text editing in content areas.

### Email

**[React Email](https://react.email/)** is used for building and rendering email templates.

### Image Storage

Images are stored in Amazon S3 buckets. Using the [Slingshot](https://github.com/CulturalMe/meteor-slingshot) Meteor package, clients get authorized and can directly upload to S3 buckets without going through the server.

## Project Structure

```
imports/
├── api/              # Server-side collections and methods
│   ├── activities/   # Public events/activities
│   ├── categories/   # Category management
│   ├── chats/        # Chat/messaging system
│   ├── composablepages/  # Dynamic page builder
│   ├── documents/    # Document attachments
│   ├── groups/       # Group management
│   ├── hosts/        # Multi-tenancy hosts
│   ├── pages/        # Static pages CMS
│   ├── platform/     # Platform settings
│   ├── resources/    # Shared resources
│   ├── users/        # User management
│   └── works/        # Portfolio works
├── ui/               # React components
│   ├── core/         # Core UI components (Box, Button, Modal, etc.)
│   ├── chattery/     # Chat components
│   ├── entry/        # Entry detail views
│   ├── forms/        # Form components
│   ├── generic/      # Shared utility components
│   ├── layout/       # Layout components (Header, Footer, Template)
│   ├── listing/      # List view components
│   └── pages/        # Page-level components
└── state.ts          # Jotai atoms for global state
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Meteor.js
- MongoDB
- AWS S3 bucket (for image storage)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eminx/cocoso.git
   cd cocoso
   ```

2. Install dependencies:

   ```bash
   meteor npm install
   ```

3. Create a settings file at `private/settings.json` with your configuration (S3 credentials, SMTP settings, etc.)

4. Run the development server:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Scripts

- `npm start` - Start the development server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size
- `npm run release` - Create a new release (auto-determines version from commits)
- `npm run release:patch` - Create a patch release (3.0.0 → 3.0.1)
- `npm run release:minor` - Create a minor release (3.0.0 → 3.1.0)
- `npm run release:major` - Create a major release (3.0.0 → 4.0.0)

## Contributing

We welcome contributions! Please follow the conventional commits format for your commit messages.

### Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation. Your commit messages should follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type       | Description                                             | Version Bump          |
| ---------- | ------------------------------------------------------- | --------------------- |
| `feat`     | A new feature                                           | Minor (3.0.0 → 3.1.0) |
| `fix`      | A bug fix                                               | Patch (3.0.0 → 3.0.1) |
| `docs`     | Documentation only changes                              | No release            |
| `style`    | Code style changes (formatting, semicolons, etc.)       | No release            |
| `refactor` | Code change that neither fixes a bug nor adds a feature | No release            |
| `perf`     | Performance improvement                                 | Patch                 |
| `test`     | Adding or updating tests                                | No release            |
| `chore`    | Maintenance tasks (dependencies, build, etc.)           | No release            |

#### Breaking Changes

For breaking changes, add `!` after the type or add `BREAKING CHANGE:` in the footer:

```bash
feat!: remove deprecated API endpoints

# or

feat: change authentication flow

BREAKING CHANGE: JWT tokens are now required for all API calls
```

Breaking changes trigger a **major** version bump (3.0.0 → 4.0.0).

#### Examples

```bash
# Feature
git commit -m "feat(calendar): add week view for mobile devices"

# Bug fix
git commit -m "fix(auth): resolve session timeout issue"

# Documentation
git commit -m "docs: update installation instructions"

# Refactor with scope
git commit -m "refactor(api): simplify user validation logic"

# Chore
git commit -m "chore(deps): update React to v18.3"

# Breaking change
git commit -m "feat(api)!: change response format for activities endpoint"
```

### Creating a Release

After making commits with conventional messages:

```bash
# Auto-determine version based on commits
npm run release

# Or specify the release type
npm run release:patch  # Bug fixes
npm run release:minor  # New features
npm run release:major  # Breaking changes

# Then push with tags
git push --follow-tags origin main
```

This will:

1. Bump the version in `package.json`
2. Generate/update `CHANGELOG.md`
3. Create a git commit and tag

## Documentation

- [React](https://react.dev/)
- [Meteor](https://docs.meteor.com/)
- [Ant Design](https://ant.design/components/overview)
- [Jotai](https://jotai.org/docs/introduction)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/get-started)
- [Zod](https://zod.dev/)

## License

GPL-3.0
