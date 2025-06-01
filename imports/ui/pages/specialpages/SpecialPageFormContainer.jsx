import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Input } from '@chakra-ui/react';
import ReactSelect from 'react-select';
import { PlusIcon } from 'lucide-react';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import SpecialPageForm from './SpecialPageForm';
import { emtptySpecialPage } from './constants';
import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import FormField from '/imports/ui/forms/FormField';

const emptyPageModal = {
  title: '',
  creating: false,
  visible: false,
};

export default function SpecialPageFormContainer() {
  const { currentHost } = useContext(StateContext);
  const [specialPageTitles, setSpecialPageTitles] = useState([]);
  const [createPageModal, setCreatePageModal] = useState(emptyPageModal);
  const navigate = useNavigate();

  const getSpecialPageTitles = async () => {
    try {
      const response = await call('getSpecialPageTitles');
      setSpecialPageTitles(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getSpecialPageTitles();
  }, []);

  const handleSelect = async (selectedOption) => {
    navigate(`/admin/special-pages/${selectedOption._id}`);
  };

  const handleCreateSpecialPage = async () => {
    try {
      const response = await call('createSpecialPage', {
        title: createPageModal.title,
        contentRows: [],
      });
      message.success('Special Page created successfully');
      setCreatePageModal(emptyPageModal);
      navigate(`/admin/special-pages/${response}`);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <>
      <Heading fontWeight="light" mb="6" size="md">
        Create a landing page, or a special page for your website.
      </Heading>

      <Flex>
        <Box flexGrow={1}>
          <ReactSelect
            options={specialPageTitles}
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
            onChange={handleSelect}
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
          onClick={() => setCreatePageModal({ ...createPageModal, visible: true })}
        >
          <PlusIcon />
          Create
        </Button>
      </Flex>

      <SpecialPageForm />

      <Routes>
        <Route path="/:specialPageId" element={<SpecialPageForm />} />
      </Routes>

      <ConfirmModal
        confirmText="Create"
        title="Please enter a title for your special page"
        visible={createPageModal.visible}
        onConfirm={() => handleCreateSpecialPage()}
        onCancel={() => setCreatePageModal((prevState) => ({ ...prevState, visible: false }))}
      >
        <FormField label="Title" required>
          <Input
            value={createPageModal.title}
            onChange={(e) =>
              setCreatePageModal((prevState) => ({ ...prevState, title: e.target.value }))
            }
          />
        </FormField>
      </ConfirmModal>
    </>
  );
}
