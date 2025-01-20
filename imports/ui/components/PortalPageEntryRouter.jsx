import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Modal from './Modal';

export default function PortalPageEntryRouter({ items, context, routeParam, children }) {
  const [tc] = useTranslation('common');
  const getActivityLink = (itemId) => {
    const selectedItem = items.find((item) => item._id === itemId);
    return `https://${selectedItem?.host}/${context}/${selectedItem?._id}`;
  };

  return (
    <Routes data-oid="pj3632q">
      <Route
        path={`/${context}/:${routeParam}`}
        render={(props) => (
          <Modal
            h="90%"
            isCentered
            isOpen
            scrollBehavior="inside"
            size="6xl"
            onClose={() => props.navigate('/' + context)}
            actionButtonLabel={tc('actions.toThePage')}
            onActionButtonClick={() =>
              (window.location.href = getActivityLink(props.match.params.activityId))
            }
            data-oid="v_vj5s."
          >
            {children(props)}
          </Modal>
        )}
        data-oid="-7bnt87"
      />
    </Routes>
  );
}
