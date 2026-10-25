import React, { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router';
import dayjs from 'dayjs';
import parseHtml from 'html-react-parser';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  canCreateContentAtom,
  currentUserAtom,
  renderedAtom,
  roleAtom,
} from '/imports/state';
import {
  Box,
  Button,
  Center,
  Flex,
  Link as CLink,
  Loader,
  Text,
} from '/imports/ui/core';
import Modal from '/imports/ui/core/Modal';
import {
  getNonComboResourcesWithColor,
  getComboResourcesWithColor,
  parseAllBookingsWithResources,
} from '/imports/api/_utils/shared';
import PageHeading from '/imports/ui/listing/PageHeading';
import Tag from '/imports/ui/generic/Tag';
import { cocosoReactSelectAdapter } from '/imports/ui/utils/globalStylesManager';
import CalendarView from '/imports/ui/pages/calendar/CalendarView';

const maxResourceLabelsToShow = 18;

interface SlotInfo {
  start: Date;
  end: Date;
  slots?: Date[];
}

interface Resource {
  _id: string;
  label: string;
  color?: string;
  isBookable: boolean;
  isCombo?: boolean;
}

interface Activity {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  resourceId?: string;
  comboResourceId?: string;
  resource?: string;
  authorName: string;
  host: string;
  activityId: string;
  groupId?: string;
  isGroupMeeting?: boolean;
  isPublicActivity?: boolean;
  isGroupPrivate?: boolean;
  longDescription?: string;
  resourceColor?: string;
}

interface CalendarHandlerProps {
  Host: any;
}

const parseNewEntryParams = (
  slotInfo: SlotInfo,
  selectedResource: Resource | null,
  type: string
) => {
  const params = {
    startDate: dayjs(slotInfo?.start).format('YYYY-MM-DD'),
    endDate: dayjs(slotInfo?.end).format('YYYY-MM-DD'),
    startTime: dayjs(slotInfo?.start).format('HH:mm'),
    endTime: dayjs(slotInfo?.end).format('HH:mm'),
    resourceId: selectedResource ? selectedResource._id : '',
  };

  if (type !== 'other') {
    params.endDate = dayjs(slotInfo?.end).add(-1, 'days').format('YYYY-MM-DD');
    params.endTime = '23:59';
  }

  return params;
};

export default function CalendarHandler({ Host }: CalendarHandlerProps) {
  const currentHost = Host;
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);
  const rendered = useAtomValue(renderedAtom);
  const { activities, resources } = useLoaderData() as {
    activities: Activity[];
    resources: Resource[];
  };
  const [modal, setModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [calendarFilter, setCalendarFilter] = useState<Resource | null>(null);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [SelectComponent, setSelectComponent] = useState<any>(null);
  const [AnimatedComponents, setAnimatedComponents] = useState<any>(null);

  const handleSelectActivity = (activity: Activity, e: React.MouseEvent) => {
    e.preventDefault();
    setModal(true);
    setSelectedActivity(activity);
  };

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    const [rangeStart, rangeEnd] = Array.isArray(range)
      ? [range[0], range[range.length - 1]]
      : [range.start, range.end];

    if (!rangeStart || !rangeEnd) {
      return;
    }

    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('rangeStart', dayjs(rangeStart).startOf('day').toISOString());
      next.set('rangeEnd', dayjs(rangeEnd).endOf('day').toISOString());
      return next;
    });
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!canCreateContent || !slotInfo) {
      return;
    }

    const selectedResource = resources.find(
      (resource) => calendarFilter && resource._id === calendarFilter._id
    );

    let type = 'other';

    if (slotInfo?.slots && slotInfo.slots.length === 1) {
      // One day selected in month view
      type = 'month-oneday';
    } else if (
      // Multiple days selected in month view
      slotInfo?.slots &&
      slotInfo.slots.length > 1 &&
      dayjs(slotInfo?.end).format('HH:mm') === '00:00'
    ) {
      type = 'month-multipledays';
    }

    const dateParams = parseNewEntryParams(
      slotInfo,
      selectedResource || null,
      type
    );

    setSearchParams((params) => ({
      ...params,
      ...dateParams,
      new: true,
    }));
  };

  const getActivityTimes = (activity: Activity | null) => {
    if (!activity) {
      return '';
    }
    if (activity.startDate === activity.endDate) {
      return `${activity.startTime}–${activity.endTime} ${dayjs(
        activity.startDate
      ).format('DD MMMM')}`;
    }
    return `${dayjs(activity.startDate).format('DD MMM')} ${
      activity.startTime
    } – ${dayjs(activity.endDate).format('DD MMM')} ${activity.endTime}`;
  };

  const isCreatorOrAdmin = () =>
    (selectedActivity &&
      currentUser &&
      currentUser.username === selectedActivity.authorName) ||
    role === 'admin';

  const handlePrimaryButtonClick = () => {
    if (!selectedActivity) return;

    const isSameHost = selectedActivity.host === currentHost.host;

    if (selectedActivity.isGroupMeeting) {
      if (isSameHost) {
        navigate(`/groups/${selectedActivity.groupId}`);
        return;
      }
      window.location.href = `https://${selectedActivity.host}/groups/${selectedActivity.groupId}`;
      return;
    }

    const listing = selectedActivity.isPublicActivity
      ? 'activities'
      : 'calendar';
    if (isSameHost) {
      navigate(`/${listing}/${selectedActivity.activityId}`);
      return;
    }
    window.location.href = `https://${selectedActivity.host}/${listing}/${selectedActivity.activityId}`;
  };

  const handleSecondaryButtonClick = () => {
    if (!isCreatorOrAdmin()) {
      closeModal();
      return;
    }

    if (!selectedActivity) return;

    if (selectedActivity.isGroupMeeting) {
      navigate(`/groups/${selectedActivity.groupId}`);
    } else {
      navigate(`/calendar/${selectedActivity.activityId}?edit=true`);
    }
  };

  const closeModal = () => {
    setModal(false);
    setTimeout(() => {
      setSelectedActivity(null);
    }, 500);
  };

  const activitiesParsed = useMemo(
    () => parseAllBookingsWithResources(activities, resources),
    [activities, resources]
  );

  const { nonComboResourcesWithColor, comboResourcesWithColor } =
    useMemo(() => {
      const nonCombo = resources.filter((r) => !r.isCombo);
      const nonComboWithColor = getNonComboResourcesWithColor(nonCombo);
      const combo = resources.filter((r) => r.isCombo);
      const comboWithColor = getComboResourcesWithColor(
        combo,
        nonComboWithColor
      );
      return {
        nonComboResourcesWithColor: nonComboWithColor,
        comboResourcesWithColor: comboWithColor,
      };
    }, [resources]);

  const filteredActivities = useMemo(
    () =>
      activitiesParsed.filter(
        (a: any) =>
          !calendarFilter ||
          calendarFilter._id === a.resourceId ||
          calendarFilter._id === a.comboResourceId
      ),
    [activitiesParsed, calendarFilter]
  );

  const allFilteredActsWithColors = useMemo(() => {
    const colorById = new Map(
      nonComboResourcesWithColor.map((r: any) => [r._id, r.color])
    );
    return filteredActivities.map((act: any) => ({
      ...act,
      resourceColor: colorById.get(act.resourceId) || '#484848',
    }));
  }, [filteredActivities, nonComboResourcesWithColor]);

  const selectFilterView = useMemo(
    () =>
      nonComboResourcesWithColor.filter((r: any) => r.isBookable).length >=
      maxResourceLabelsToShow,
    [nonComboResourcesWithColor, maxResourceLabelsToShow]
  );

  const allResourcesForSelect = useMemo(
    () =>
      [...comboResourcesWithColor, ...nonComboResourcesWithColor].filter(
        (r: any) => r.isBookable
      ),
    [comboResourcesWithColor, nonComboResourcesWithColor]
  );

  useEffect(() => {
    if (selectFilterView && !SelectComponent) {
      Promise.all([
        import('react-select'),
        import('react-select/animated'),
      ]).then(([selectMod, animatedMod]) => {
        setSelectComponent(() => selectMod.default);
        setAnimatedComponents(animatedMod.default());
      });
    }
  }, [selectFilterView, SelectComponent]);

  if (!currentHost) {
    return <Loader />;
  }

  return (
    <>
      <PageHeading currentHost={currentHost || Host} listing="calendar" />

      <Box>
        <Center mb="2">
          {!selectFilterView ? (
            <Box>
              <Flex justify="center" px="1" pb="1" mb="3" wrap="wrap">
                <Box>
                  <Tag
                    key="All"
                    checkable
                    label={<Trans i18nKey="common:labels.all">All</Trans>}
                    filterColor="#484848"
                    checked={!calendarFilter}
                    css={{ alignSelf: 'center' }}
                    onClick={() => setCalendarFilter(null)}
                  />
                </Box>

                {nonComboResourcesWithColor
                  .filter((r: any) => r.isBookable)
                  .map((resource: any) => (
                    <Box key={resource._id}>
                      <Tag
                        checkable
                        label={resource.label}
                        filterColor={resource.color}
                        checked={calendarFilter?._id === resource._id}
                        onClick={() => setCalendarFilter(resource)}
                      />
                    </Box>
                  ))}
              </Flex>
              <Flex justify="center" mb="2" px="1" wrap="wrap">
                {comboResourcesWithColor
                  .filter((r: any) => r.isBookable)
                  .map((resource: any) => (
                    <Box key={resource._id}>
                      <Tag
                        checkable
                        label={resource.label}
                        filterColor={'#2d2d2d'}
                        gradientBackground={resource.color}
                        checked={calendarFilter?._id === resource._id}
                        onClick={() => setCalendarFilter(resource)}
                      />
                    </Box>
                  ))}
              </Flex>
            </Box>
          ) : (
            <Flex w="30rem">
              <Button
                colorScheme="green"
                mr="2"
                size="sm"
                variant={calendarFilter ? 'outline' : 'solid'}
                onClick={() => setCalendarFilter(null)}
              >
                {<Trans i18nKey="common:labels.all">All</Trans>}
              </Button>

              <Box w="100%">
                {SelectComponent ? (
                  <SelectComponent
                    components={AnimatedComponents || undefined}
                    isClearable
                    options={allResourcesForSelect}
                    style={{ width: '100%', marginTop: '1rem' }}
                    styles={{
                      control: cocosoReactSelectAdapter,
                      option: (styles, { data }) => ({
                        ...styles,
                        borderLeft: `8px solid ${data.color}`,
                        // background: data.color.replace('40%', '90%'),
                        paddingLeft: !data.isCombo && 6,
                        fontWeight: data.isCombo ? 'bold' : 'normal',
                      }),
                    }}
                    value={calendarFilter}
                    getOptionValue={(option) => option._id}
                    onChange={(value) => setCalendarFilter(value)}
                  />
                ) : (
                  <Box h="2.5rem" w="100%" />
                )}
              </Box>
            </Flex>
          )}
        </Center>

        <Box mb="4">
          <CalendarView
            activities={allFilteredActsWithColors}
            resources={resources}
            onSelect={handleSelectActivity}
            onSelectSlot={handleSelectSlot}
            onRangeChange={handleRangeChange}
          />
        </Box>
      </Box>

      {rendered && canCreateContent ? (
        <Modal
          id="calendar-item"
          open={modal && Boolean(selectedActivity)}
          title={selectedActivity && selectedActivity.title}
          confirmText={
            currentHost?.isPortalHost ? (
              <Trans
                i18nKey="common:actions.toThePage"
                values={{ hostName: currentHost?.settings?.name }}
              />
            ) : (
              <Trans i18nKey="common:actions.entryPage" />
            )
          }
          cancelText={
            isCreatorOrAdmin() ? (
              <Trans i18nKey="common:actions.update">Edit</Trans>
            ) : (
              <Trans i18nKey="common:actions.close">Close</Trans>
            )
          }
          onClose={() => closeModal()}
          onConfirm={() => handlePrimaryButtonClick()}
          onCancel={() => handleSecondaryButtonClick()}
        >
          <Box
            bg="theme.50"
            style={{ fontFamily: 'Courier, monospace' }}
            p="2"
            my="1"
          >
            <div>
              <Link to={`/@${selectedActivity?.authorName}`}>
                <CLink as="span" fontWeight="bold">
                  {selectedActivity && selectedActivity.authorName}
                </CLink>{' '}
              </Link>
              <Text as="span">
                {<Trans i18nKey="common:labels.booked">booked</Trans>}
              </Text>{' '}
              <Link to={`/resources/${selectedActivity?.resourceId}`}>
                <CLink as="span" fontWeight="bold">
                  {selectedActivity && selectedActivity.resource}
                </CLink>
              </Link>
            </div>
            <Text>{getActivityTimes(selectedActivity)}</Text>
          </Box>

          <Text fontSize="sm" mt="2" p="1">
            {selectedActivity?.longDescription &&
              (selectedActivity?.isGroupPrivate
                ? ''
                : parseHtml(selectedActivity?.longDescription))}
          </Text>
        </Modal>
      ) : null}
    </>
  );
}
