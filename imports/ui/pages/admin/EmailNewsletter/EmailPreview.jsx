import React from 'react';
import {
  Body,
  Button as EmButton,
  Column,
  Container,
  Head,
  Heading as EmHeading,
  Hr,
  Html,
  Img,
  Link as EmLink,
  Row,
  Section,
  Text as EmText,
} from '@react-email/components';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export default function EmailPreview({ currentHost, email, imageUrl }) {
  if (!email) {
    return null;
  }
  const [tc] = useTranslation('common');

  const { appeal, body, footer, image, items, subject } = email;
  const uploadableImageLocal = image?.uploadableImageLocal;
  const activities = items?.activities;
  const works = items?.works;

  const { host, logo, settings } = currentHost;
  const activitiesLabel =
    settings?.menu?.find((item) => item.name === 'activities')?.label || 'Activities';
  const worksLabel = settings?.menu?.find((item) => item.name === 'works')?.label || 'Works';

  return (
    <Html>
      <Head />
      <Body style={{ padding: 12 }}>
        <Container>
          <Img
            alt={settings?.name}
            height="50px"
            src={logo}
            style={{ height: '50px', margin: '0 auto', width: 'auto' }}
            width="auto"
          />
          <EmHeading
            as="h1"
            style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center' }}
          >
            {settings?.name}
          </EmHeading>
        </Container>

        <Section style={{ marginBottom: 12 }}>
          <EmText style={{ fontSize: 16 }}>{`${appeal} [username],`}</EmText>
          {(imageUrl || uploadableImageLocal) && (
            <Img
              style={{ marginBottom: 12 }}
              src={imageUrl || uploadableImageLocal}
              alt={subject}
              width="100%"
              height="auto"
            />
          )}

          {body && <EmText>{renderHTML(body)}</EmText>}

          <Hr />
        </Section>

        {items && activities && (
          <>
            <EmHeading as="h2" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
              {activitiesLabel}
            </EmHeading>
            {activities?.map((activity) => (
              <Section key={activity._id} style={{ marginBottom: 24 }}>
                <EmLink
                  href={`https://${host}/activities/${activity._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <EmHeading as="h3" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {activity?.title}
                  </EmHeading>
                </EmLink>
                <EmText style={{ fontSize: 16 }}>{activity?.subTitle}</EmText>
                <Img
                  src={activity?.imageUrl}
                  width="100%"
                  height="auto"
                  style={{ marginBottom: 12 }}
                />
                <ActivityDates activity={activity} />
                <EmText>{activity?.longDescription && renderHTML(activity.longDescription)}</EmText>
                <EmButton
                  href={`https://${host}/activities/${activity._id}`}
                  style={{ color: '#0f64c0', fontWeight: 'bold', marginBottom: 12 }}
                >
                  {tc('actions.entryPage')}
                </EmButton>
                <Hr />
              </Section>
            ))}
          </>
        )}

        {items && works && (
          <>
            <EmHeading as="h2" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
              {worksLabel}
            </EmHeading>
            {works?.map((work) => (
              <Section key={work._id} style={{ marginBottom: 24 }}>
                <EmLink
                  href={`https://${host}/@${work.authorUsername}/works/${work._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <EmHeading as="h3" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {work?.title}
                  </EmHeading>
                </EmLink>
                <EmText style={{ fontSize: 16, marginTop: 4 }}>{work?.shortDescription}</EmText>
                {work.images && (
                  <Img
                    src={work.images[0]}
                    width="100%"
                    height="auto"
                    style={{ marginBottom: 12 }}
                  />
                )}
                <EmText>{work?.longDescription && renderHTML(work.longDescription)}</EmText>
                <EmButton
                  href={`https://${host}/@${work.authorUsername}/works/${work._id}`}
                  style={{ color: '#0f64c0', fontWeight: 'bold', marginBottom: 12 }}
                >
                  {tc('actions.entryPage')}
                </EmButton>
                <Hr />
              </Section>
            ))}
          </>
        )}

        <Section>
          {footer && (
            <EmText style={{ fontSize: 14, textAlign: 'center' }}>{renderHTML(footer)}</EmText>
          )}
          <EmLink href={`https://${host}`} style={{ color: '#0f64c0', textAlign: 'center' }}>
            <EmText>{host}</EmText>
          </EmLink>
        </Section>
      </Body>
    </Html>
  );
}

export function ActivityDates({ activity }) {
  if (!activity) {
    return null;
  }
  const length = activity.datesAndTimes?.length;

  return (
    <Row style={{ marginLeft: 0, marginTop: 4, width: 'auto' }}>
      {length < 4
        ? activity?.datesAndTimes?.map((date) => (
            <ActivityDate key={date.startDate + date.endTime} date={date} />
          ))
        : activity?.datesAndTimes
            ?.filter((d, i) => i < 3)
            .map((date) => <ActivityDate key={date.startDate + date.endTime} date={date} />)}
      <Column>
        <EmText>{length > 3 && '+' + (length - 3).toString()}</EmText>
      </Column>
    </Row>
  );
}

export function ActivityDate({ date }) {
  return (
    <Column style={{ paddingRight: 8 }}>
      <EmText style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
        {moment(date.startDate).format('DD')}
      </EmText>
      <EmText style={{ fontSize: '14px', margin: 0, marginTop: -4 }}>
        {moment(date.startDate).format('MMMM')}
      </EmText>
    </Column>
  );
}
