import React from 'react';

import SlideWidget from '../../../entry/SlideWidget';
import ContactInfo from '../../profile/ContactInfo';

export default function UserInteractionHandler({ user, slideStart }) {
  if (!user) {
    return null;
  }

  return (
    <SlideWidget justify="center" slideStart={slideStart}>
      <ContactInfo username={user.username} />
    </SlideWidget>
  );
}
