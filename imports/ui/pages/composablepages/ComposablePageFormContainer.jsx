import React, { useContext, useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Box, Button, Flex, Heading, Input } from '@chakra-ui/react';
import ReactSelect from 'react-select';
import { PlusIcon } from 'lucide-react';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import ComposablePageForm from './ComposablePageForm';
import { emtptyComposablePage } from './constants';
import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import FormField from '/imports/ui/forms/FormField';

export default function ComposablePageFormContainer({
  composablePageTitles,
  onCreatePage,
  onSelectPage,
}) {
  const { composablePageId } = useParams();

  const selectedPage = composablePageTitles.find(
    (page) => page._id === composablePageId
  );

  if (!selectedPage) {
    return null;
  }

  return (
    <>
      <Flex>
        <Box flexGrow={1}>
          <ReactSelect
            options={composablePageTitles}
            placeholder="Select a page"
            value={selectedPage}
            styles={{
              option: (styles, { data }) => ({
                ...styles,
                borderLeft: `8px solid ${data.color}`,
                paddingLeft: 6,
                fontSize: 14,
              }),
            }}
            onChange={onSelectPage}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />
        </Box>

        <Button
          flexGrow={0}
          mb="8"
          ml="4"
          mt="1"
          size="sm"
          variant="outline"
          onClick={onCreatePage}
        >
          <PlusIcon />
          Create
        </Button>
      </Flex>

      <Box>
        <ComposablePageForm />
      </Box>
    </>
  );
}
