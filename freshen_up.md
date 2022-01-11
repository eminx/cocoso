# COCOSO || FRESHEN UP

## up for the update 

After the updating our server and client side codes

This branch focus on:

- update packages mostly on Meteor :
  with meteor update command now we are using 2.5.3  | tested

- cleaning deprecated packages mostly on Npm
  - checked the packages imports to find out usage | tested
  - used npm outdated command and updated minor versions | tested

- improving & debuging mostly on server/api 
  - pass defaults from methods to schemas | tested

- addin a FRESH-INSTALLATION code | tested on a new copy and port
  - with constants checks the existance and sets;
   - superAdmin User
   - first Host
   - User & Host membership
   - Host info Page

- organize imports/ui folder according to meteor guide

## skeleton ui

both skeleton and skeleton-api branches were focused on folder structure 
and for ui there is also some organisation needed 

  ui/
    components/                # all reusable components in the application
                               # can be split by domain if there are many
    layouts/                   # wrapper components for behaviour and visuals
    pages/                     # entry points for rendering used by the router

more details: https://guide.meteor.com/structure.html#javascript-structure

## ending

now we are up to date, 
totally revised our server and client codes and structure,
and ready to install 


### next branches

- i18n-schemas 
  getting ready for i18n 
  from all static text in ui (error, notifications, menus, forms, etc)
  creating locales files in YAML (readable, editable, commentable json)
  ***this branch wont be an implementation of i18n
