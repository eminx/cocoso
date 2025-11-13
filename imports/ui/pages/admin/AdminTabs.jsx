import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Box, Tabs } from '/imports/ui/core';

export default function AdminTabs({ tabs, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location?.pathname;
  const tabIndex = tabs?.findIndex((tab) => pathname.includes(tab.path));

  useEffect(() => {
    if (!tabs.find((tab) => pathname.includes(tab.path))) {
      navigate(tabs[0]?.path);
    }
  }, [pathname]);

  return (
    <>
      <Box mb="8">
        <Tabs index={tabIndex} tabs={tabs} />
      </Box>

      {children}
    </>
  );
}
