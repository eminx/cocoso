import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import NewSpecialPage from './NewSpecialPage';
import { emtptySpecialPage } from './datatypes';

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

  const onSelect = async (selectedOption) => {
    console.log(selectedOption);
  };

  return (
    <div>
      <Heading fontWeight="light" mb="6" size="md">
        Create a landing page, or a special page for your website.
      </Heading>

      <Flex>
        <Box flexGrow={1}>
          <ReactSelect
            options={specialPages}
            // placeholder={t('portalHost.selectHost')}
            // value={hostFilterValue}
            styles={{
              option: (styles, { data }) => ({
                ...styles,
                borderLeft: `8px solid ${data.color}`,
                paddingLeft: 6,
                fontSize: 14,
              }),
            }}
            onChange={onSelect}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />
        </Box>

        <Button flexGrow={0} mb="8" ml="4">
          <PlusIcon />
          Create
        </Button>
      </Flex>

      <NewSpecialPage />

      <Routes>
        {specialPages.map((specialPage) => (
          <Route
            key={specialPage._id}
            path={`/specialpages/${specialPage._id}`}
            element={<NewSpecialPage page={specialPage} />}
          />
        ))}
      </Routes>
    </div>
  );
}
