# COCOSO || SKELETON-API

This branch is to update API/SERVER folder and javascript structure according to meteor guide  
https://guide.meteor.com/structure.html#javascript-structure


```
imports/
  api/
    @/                         # new shared folder
      shared.js
      schemas.js
      services/                # 3rd party services like MAIL & AWS 

    lists/                     # a unit of domain logic
      list.js                  # definition of the Lists collection with schemas
      list.methods.js          # methods related to lists
      list.publications.js     # all list-related publications

    startup/
      server/
        api.js                # server imports

    ui/
      ListContainer.js        # container files wit trackers

```
## What changed ?

All collections in lib folder collections file are seperated in to unit domain logic
In UI folder some jsx files like
LayoutContainer, Calender ... imports updated
All ...Container.js withTrackers imports updated

All methods passed to related folder
All publishes are seperated to related files

@ is new sharedd folder
email, aws services, 3rd party commeon services are in shared folder
user role checks like isAdmin, isMember etc moved to user.roles.js under @users folder

localhost tests for all collections and creating editing deleting collections with schema implementations.

## What more ?

Detailed optimisation on Schemas and more tests...

Seperating Emails from methods to ther of files;
  for example; Activity Mails will be in activities/activity.mails.js and will be imported to where it needs ....

## Completed Steps
- API Structure
  - Reorganize Folder Structue
  - Update imports
  - Test on Localhost



## Next Steps
- UI Structure

## Past Steps
- Common Structure