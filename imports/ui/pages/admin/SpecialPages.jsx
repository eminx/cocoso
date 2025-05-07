import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

const emtptySpecialPage = {
  title: '',
  contentRows: [
    {
      gridType: '3',
      columns: [
        {
          type: 'text',
          content: {},
        },
      ],
    },
  ],
};

export default function SpecialPages() {
  const { currentHost } = useContext(StateContext);
  const [specialPages, setSpecialPages] = useState([emtptySpecialPage]);

  const getSpecialPages = async () => {
    try {
      const response = await call('getSpecialPages');
      setSpecialPages(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getSpecialPages();
  }, []);

  return (
    <div>
      <h1>Landing Pages</h1>
      <ul>
        {specialPages?.map((page) => (
          <li key={page.title} path={`${page.title}/*`} element={<div>{page.title}</div>} />
        ))}
      </ul>
    </div>
  );
}
