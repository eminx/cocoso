# Nodal
A dedicated app for managing collaborative gatherings at Noden, and maybe some other places ^^

## Brief
This application will enable members of Noden to get actively engaged at planning, administering and facilitating different events and gatherings at Noden. The aim is to have a dedicated platform with which any member can have an account in order to both participate and create a gathering at Noden without an external dependency (such as Facebook). We are trying to build this so that we can collaboratively use the resources Noden provides and have the members benefit from each other in a best way.

## Guidelines for MVP
- Every member has a dedicated account that is bound to the Moonclerk payment system - to authenticate and authorise active and passive memberships (active: recurring payments, passive: once a year)
- This account is automatically created on Nodal. They receive a welcome email on succesful payment via Moonclerk. 
- A member can log in and initiate the creation of a gathering with a title, description, capacity, room (in Noden), date & time and an image
- A super-admin has to confirm a gathering to be held at Noden to happen, which can be initiated by any member
- A member or a non-member can preview all gatherings happening at Noden
- A member can/have to RSVP to confirm herself as a participant to a certain gathering (facilitator defines if RSVPing is mandatory for participation)
- A member can view her current status of membership such the info about the recurring payments (what more?) etc.
- A gathering/workshop/event facilitator can view certain information such as:
  - A list of RSVP'ed members with the info of whether or not they are paying members
 
## Installation & Running

1. Make sure to have installed Node on your computer, by going to this url and downloading its package: ```https://nodejs.org/en/```

2. Install meteor locally by running: ```curl https://install.meteor.com/ | sh``` on your terminal (OSX & Linux). For Windows, refer to the meteor website: https://www.meteor.com/install

3. Clone the repo to your computer at your favourite location: ```git clone git@github.com:eminx/Nodal.git```

4. Go to the repo: ```cd Nodal```

5. Run ```meteor npm install```

Your installation should be finished. Just do this to run the app:

```meteor``` or ```npm start```

And go to: ```localhost:3000``` on your favourite browser.

## Documentations

Ant Design: https://ant.design

React JS: https://reactjs.org/docs

Meteor: http://docs.meteor.com/#/full/
