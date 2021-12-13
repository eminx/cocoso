# COCOSO || SKELETON

This branch is to update folder and javascript structure according to meteor guide 
https://guide.meteor.com/structure.html#javascript-structure


```
imports/
  startup/
    client/
      index.js                 # import client startup through a single index entry point
      routes.js                # set up all routes in the app
      useraccounts-configuration.js # configure login templates
    server/
      fixtures.js              # fill the DB with example data on startup
      index.js                 # import server startup through a single index entry point

  api/
    lists/                     # a unit of domain logic
      server/
        publications.js        # all list-related publications
        publications.tests.js  # tests for the list publications
      lists.js                 # definition of the Lists collection
      lists.tests.js           # tests for the behavior of that collection
      methods.js               # methods related to lists
      methods.tests.js         # tests for those methods

  ui/
    components/                # all reusable components in the application
                               # can be split by domain if there are many
    layouts/                   # wrapper components for behaviour and visuals
    pages/                     # entry points for rendering used by the router

client/
  main.js                      # client entry point, imports all client code

public/                        # served as-is to the client. referencing these assets, do not include public/

server/
  main.js                      # server entry point, imports all server code

private/                       # only accessible from server code and can be loaded via the Assets API

packages/                      # used for local packages
```


## Completed Steps
- Common Structure
  - Reorganize Folder Structue
  - Update imports
  - Test on Localhost

## Next Steps
- API Structure
- UI Structure
