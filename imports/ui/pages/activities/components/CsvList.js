import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { Box, Button, Center } from '/imports/ui/core';

const getFileName = (occurrence, title) => {
  if (occurrence.startDate !== occurrence.endDate) {
    return `${title} | ${occurrence.startDate}-${occurrence.endDate}, ${occurrence.startTime}-${occurrence.endTime}`;
  }
  return `${title} | ${occurrence.startDate}, ${occurrence.startTime}-${occurrence.endTime}`;
};

export default function RsvpList({ occurrence, title }) {
  if (!occurrence) {
    return null;
  }

  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const columns = useMemo(
    () => [
      {
        Header: t('public.register.form.name.first'),
        accessor: 'firstName',
      },
      {
        Header: t('public.register.form.name.last'),
        accessor: 'lastName',
      },
      {
        Header: t('public.register.form.people.label'),
        accessor: 'numberOfPeople',
      },
      {
        Header: t('public.register.form.email'),
        accessor: 'email',
      },
    ],
    []
  );

  const attendees = occurrence?.attendees;
  const table = useTable({ columns, data: attendees });

  return (
    <Box>
      <Center p="2">
        <CSVLink
          data={attendees}
          filename={getFileName(occurrence, title)}
          target="_blank"
        >
          <Button size="sm">{tc('actions.downloadCSV')}</Button>
        </CSVLink>
      </Center>

      <table style={{ width: '100%' }}>
        <thead>
          {table.headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th key={column.id}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.rows.map((row) => {
            table.prepareRow(row);
            return (
              <tr key={row.id}>
                {row.cells.map((cell) => (
                  <td key={cell.id}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}
