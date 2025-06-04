import React, { useContext, useState, useEffect } from 'react';
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Link as CLink,
} from '@chakra-ui/react';
import ReactSelect from 'react-select';
import { PlusIcon } from 'lucide-react';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import ComposablePageFormContainer from './ComposablePageFormContainer';
import { emtptyComposablePage } from './constants';
import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import FormField from '/imports/ui/forms/FormField';
import Boxling from '/imports/ui/pages/admin/Boxling';

function ComposablePagesListing({
  composablePageTitles,
  onCreatePage,
}) {
  return (
    <>
      <Center>
        <Button
          leftIcon={<PlusIcon />}
          mb="8"
          size="lg"
          variant="outline"
          onClick={onCreatePage}
        >
          CREATE
        </Button>
      </Center>
      <Box flexGrow={1}>
        {composablePageTitles.map((composablePage) => (
          <Link
            key={composablePage._id}
            to={`/admin/composable-pages/${composablePage._id}`}
          >
            <Boxling mb="4">
              <CLink as="span">
                <Heading color="blue.600" size="lg">
                  {composablePage.title}
                </Heading>
              </CLink>
            </Boxling>
          </Link>
        ))}
      </Box>
    </>
  );
}

const emptyPageModal = {
  title: '',
  creating: false,
  visible: false,
};

export default function ComposablePages() {
  const { currentHost } = useContext(StateContext);
  const [composablePageTitles, setComposablePageTitles] = useState([]);
  const [createPageModal, setCreatePageModal] =
    useState(emptyPageModal);
  const navigate = useNavigate();
  const location = useLocation();

  const getComposablePageTitles = async () => {
    try {
      const response = await call('getComposablePageTitles');
      setComposablePageTitles(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getComposablePageTitles();
  }, []);

  const handleSelectPage = async (selectedOption) => {
    navigate(`/admin/composable-pages/${selectedOption._id}`);
  };

  const onCreatePage = () => {
    setCreatePageModal((prevModal) => ({
      ...prevModal,
      visible: true,
    }));
  };

  const handleCreateComposablePage = async () => {
    try {
      const response = await call('createComposablePage', {
        title: createPageModal.title,
        contentRows: [],
      });
      await getComposablePageTitles();
      message.success('Special Page created successfully');
      setCreatePageModal(emptyPageModal);
      navigate(`/admin/composable-pages/${response}`);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const isPageSelected = composablePageTitles.find((composablePage) =>
    location.pathname.includes(composablePage._id)
  );

  return (
    <>
      <Heading fontWeight="light" mb="6" size="md">
        Compose a page and assign it as a landing page, campaign page,
        or just any page you want...
      </Heading>

      {!isPageSelected && (
        <ComposablePagesListing
          composablePageTitles={composablePageTitles}
          onCreatePage={onCreatePage}
        />
      )}

      <Routes>
        <Route
          path=":composablePageId"
          element={
            <ComposablePageFormContainer
              composablePageTitles={composablePageTitles}
              onCreatePage={onCreatePage}
              onSelectPage={handleSelectPage}
            />
          }
        />
      </Routes>

      <ConfirmModal
        confirmText="Create"
        title="Please enter a title for your special page"
        visible={createPageModal.visible}
        onConfirm={() => handleCreateComposablePage()}
        onCancel={() =>
          setCreatePageModal((prevState) => ({
            ...prevState,
            visible: false,
          }))
        }
      >
        <FormField label="Title" required>
          <Input
            size="lg"
            value={createPageModal.title}
            onChange={(e) =>
              setCreatePageModal((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
          />
        </FormField>
      </ConfirmModal>
    </>
  );
}
