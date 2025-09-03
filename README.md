# Community Cooperation Software

![Cocoso logo](https://www.cocoso.info/cocoso-logo.png)

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

The way accounts work for the multi tenancy feature in Cocoso is each account is global, but can have different privileges in different spaces. This will allow users to have relation to each other in between spaces while keeping their privileges only in their own spaces. It is designed for autonomy in mind.

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

The calendar is shown with _Month_ (default), _Week_, _Day_ and _Agenda_ views using Big Calendar, open source React component library. One can navigate to previous or next month/week/day with a click. It's just like the calendar app you're using but embedded on a webpage.

Each entry in calendar could be assigned a different category such as a _resource_ booked or a type of activity such as _yoga_. It'd be useful for both presenting different kinds of entries as well different kinds of bookings. Like every each feature in Cocoso, intentionally made very abstract so that it can be applied to different use cases.

See Big Calendar: https://github.com/jquense/react-big-calendar

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

Cocoso is built using Meteor JS framework which is built on top of Node JS. Meteor is an open source and free development framework that has been used for nearly 10 years so far. It is actively being built and maintained by Meteor Development Group (MDG). Meteor works with MongoDB by default and it provides first class support for it on top of the DDP protocol featuring reactive programming super easily with Web Sockets. So MongoDB is the chosen database. Using Meteor, it is also relatively easy to create native apps by buit-in usage of Cordova, which runs on a web-view within a downloaded and installed app, and features customisations via plugins such as to enable push notifications and other relevant features that may be wished to have in a typical native app.

MDG is also the group behind a widespread used product called _Apollo_, which is a technology built for complementing another open source technology called _GraphQL_ developed and maintained by Facebook. The usage of both GraphQL and Apollo are extremely widespread nowadays.

The reason MeteorJS has been chosen is not only the values behind MDG are in line with that of ours; but also the technology they have built is so powerful and simple. Long before web apps were a trend and reactive programming was a thing (as in now); one could, with relatively little programming knowledge, easily create web apps that feature these characteristics using Meteor.

### Database

Cocoso requires a MongoDB database to work with, since Meteor JS provides first class support for it. User accounts system is also powered by Meteor's built-in modules and saved in a dedicated collection in MongoDB. Passwords of users are always stored encrypted so system admins do not have the ability the see them.

### User Interface

**ReactJS** has been the main user interface framework chosen to build the UI for Cocoso. ReactJS is probably the most widespread used client framework that is currently used worldwide, along with _VueJS_. It's been developed and actively maintained by a dedicated team at Facebook; but doesn't necessarily have any affiliation with them. Its licenced with MIT licence.

### Image Storage

Images are currently stored in Amazon S3 buckets, because it has been the easiest way to make the solution. With some smart open source solution called Slingshot, clients get authorized and then can directly upload to S3 buckets without having to go through the server.

## Documentation

### Main libraries used

React JS: https://reactjs.org/docs

Meteor: http://docs.meteor.com/#/full/
