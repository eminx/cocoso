import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center } from '@chakra-ui/react';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { StateContext } from '../../LayoutContainer';
import { call, compareForSort } from '../../utils/shared';
import NewGridThumb from '../../components/NewGridThumb';
import { message } from '../../components/message';
import Tabs from '../../components/Tabs';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tably from '../../components/Tably';
import Modal from '../../components/Modal';
import HostFiltrer from '../../components/HostFiltrer';

moment.locale(i18n.language);

export default function ProcessesList() {
  const [processes, setProcesses] = useState([]);
  const [filter, setFilter] = useState('active');
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalProcess, setModalProcess] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const { allHosts, currentHost, currentUser } = useContext(StateContext);

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    try {
      setProcesses(await call('getProcesses', Boolean(currentHost.isPortalHost)));
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const getFilteredProcesses = () => {
    if (!processes) {
      return <Loader />;
    }

    const filteredProcesses = processes.filter((process) => {
      const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
      const processWordFiltered =
        process?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        process?.readingMaterial?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
      if (filter === 'archived') {
        return process.isArchived && processWordFiltered;
      } else if (filter === 'my') {
        return (
          currentUser &&
          process.members.some((member) => member.memberId === currentUser._id) &&
          processWordFiltered
        );
      }
      return !process.isArchived && processWordFiltered;
    });

    return parseOnlyAllowedProcesses(filteredProcesses);
  };

  const parseOnlyAllowedProcesses = (futureProcesses) => {
    const futureProcessesAllowed = futureProcesses.filter((process) => {
      if (!process.isPrivate) {
        return true;
      }
      if (!currentUser) {
        return false;
      }
      const currentUserId = currentUser._id;
      return (
        process.adminId === currentUserId ||
        process.members.some((member) => member.memberId === currentUserId) ||
        process.peopleInvited.some((person) => person.email === currentUser.emails[0].address)
      );
    });

    return getProcessesSorted(futureProcessesAllowed);
  };

  const getProcessesSorted = (filteredProcesses) => {
    if (sorterValue === 'name') {
      return filteredProcesses.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return filteredProcesses.sort(compareForSort).reverse();
    }
  };

  if (!processes || !processes.length === 0) {
    return null;
  }

  const getProcessesRenderedHostFiltered = (processesRendered) => {
    if (!currentHost.isPortalHost || !hostFilterValue) {
      return processesRendered;
    }
    return processesRendered.filter((process) => process.host === hostFilterValue.host);
  };

  const processesRendered = getFilteredProcesses();
  const processesRenderedHostFiltered = getProcessesRenderedHostFiltered(processesRendered);

  const allHostsFiltered = allHosts?.filter((host) => {
    return processesRendered.some((process) => process.host === host.host);
  });

  const tabs = [
    {
      title: t('tabs.active'),
      onClick: () => setFilter('active'),
    },
    {
      title: t('tabs.members'),
      onClick: () => setFilter('my'),
    },
    {
      title: t('tabs.archived'),
      onClick: () => setFilter('archived'),
    },
  ];

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  return (
    <Box w="100%">
      <Helmet>
        <title>{`${tc('domains.processes')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <Center>
        <FiltrerSorter {...filtrerProps}>
          <Tabs mx="4" size="sm" tabs={tabs} />
        </FiltrerSorter>
      </Center>

      {currentHost.isPortalHost && (
        <Center>
          <HostFiltrer
            allHosts={allHostsFiltered}
            hostFilterValue={hostFilterValue}
            onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
          />
        </Center>
      )}

      <Paginate items={processesRenderedHostFiltered}>
        {(process) => (
          <Box key={process._id}>
            {currentHost.isPortalHost ? (
              <Box cursor="pointer" onClick={() => setModalProcess(process)}>
                <NewGridThumb
                  host={process.host}
                  imageUrl={process.imageUrl}
                  subTitle={process.readingMaterial}
                  title={process.title}
                />
              </Box>
            ) : (
              <Link to={`/processes/${process._id}`}>
                <NewGridThumb
                  imageUrl={process.imageUrl}
                  subTitle={process.readingMaterial}
                  title={process.title}
                />
              </Link>
            )}
          </Box>
        )}
      </Paginate>

      {modalProcess && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalProcess(null)}
          actionButtonLabel={tc('actions.toThePage')}
          onActionButtonClick={() =>
            (window.location.href = `https://${modalProcess.host}/processes/${modalProcess._id}`)
          }
        >
          <Tably
            content={modalProcess.description && renderHTML(modalProcess.description)}
            images={[modalProcess.imageUrl]}
            subTitle={modalProcess.readingMaterial}
            tags={[modalProcess.host]}
            title={modalProcess.title}
          />
        </Modal>
      )}
    </Box>
  );
}
