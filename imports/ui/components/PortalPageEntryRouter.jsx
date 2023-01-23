import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Modal from './Modal';

export default function PortalPageEntryRouter({ items, context, routeParam, children }) {
  const [tc] = useTranslation('common');
  const getActivityLink = (itemId) => {
    const selectedItem = items.find((item) => item._id === itemId);
    return `https://${selectedItem?.host}/${context}/${selectedItem?._id}`;
  };

  return (
    <Switch>
      <Route
        path={`/${context}/:${routeParam}`}
        render={(props) => (
          <Modal
            h="90%"
            isCentered
            isOpen
            scrollBehavior="inside"
            size="6xl"
            onClose={() => props.history.push('/' + context)}
            actionButtonLabel={tc('actions.toThePage')}
            onActionButtonClick={() =>
              (window.location.href = getActivityLink(props.match.params.activityId))
            }
          >
            {children(props)}
          </Modal>
        )}
      />
    </Switch>
  );
}
