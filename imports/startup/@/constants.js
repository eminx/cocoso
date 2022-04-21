const defaultMenu = [
  {
    label: 'Activities',
    name: 'activities',
    isVisible: true,
    isHomePage: true,
  },
  {
    label: 'Processes',
    name: 'processes',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Calendar',
    name: 'calendar',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Works',
    name: 'works',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Members',
    name: 'members',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Resources',
    name: 'resources',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Info',
    name: 'info',
    isVisible: true,
    isHomePage: false,
  },
];

const defaultMainColor = {
  hsl: {
    h: '144',
    s: 0.8,
    l: 0.35,
  },
};

const defaultEmails = [
  {
    title: 'Welcome Email',
    subject: 'Welcome as a participant',
    appeal: 'Dear',
    body: 'Welcome! As a participant, you may attend our processes and activities. Look forward to hanging out with you!',
  },
  {
    title: 'New Contributor',
    subject: 'You are now a contributor',
    appeal: 'Dear',
    body: 'You are now verified to be a contributor in our space. This means that you are privileged to create public activities & processes, publish your works, and book resources in our community. \nLook forward!',
  },
  {
    title: 'New Admin',
    subject: 'You are now an admin',
    appeal: 'Dear',
    body: 'You are now registered as an admin in our space. This means that in addition to the privileges of being a contributor; you may create new pages and configure a bunch of options in our shared system. Please use your powers responsible, and enjoy. \nLook forward!',
  },
];

export {
  defaultMenu,
  defaultMainColor,
  defaultEmails,
};
