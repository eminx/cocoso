import React from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router';

import { Box } from '/imports/ui/core';

import Tabs from '../core/Tabs';

export default function TablyRouter({ tabs, children }) {
  const location = useLocation();

  const pathname = location?.pathname;
  const pathnameLastPart = pathname?.split('/').pop();
  const tabIndex = tabs && tabs.findIndex((tab) => pathname.includes(tab.path));

  if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
    return <Navigate to={tabs[0].path} />;
  }

  return (
    <Box>
      <Tabs index={tabIndex} mb="4" tabs={tabs} />

      {children}

      <Box mb="24">
        <Routes>
          {tabs.map((tab) => (
            <Route key={tab.title} path={tab.path} element={tab.content} />
          ))}
        </Routes>
      </Box>
    </Box>
  );
}
