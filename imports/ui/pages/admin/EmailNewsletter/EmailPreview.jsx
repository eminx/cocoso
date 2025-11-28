import React from 'react';
import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Column } from '@react-email/column';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Row } from '@react-email/row';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

import parseHtml from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

function shorten(str) {
  const strArray = str.split(/\s+/);
  return [...strArray.slice(0, 100)].join(' ') + '...';
}

function stripAndShorten(html) {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  const stripped = tmp.textContent || tmp.innerText || '';
  return shorten(stripped);
}

const yesterday = dayjs(new Date()).add(-1, 'days');

const stylesDateSign = { fontWeight: 'bold', margin: 0 };

function DateSign({ date }) {
  return (
    <Column style={{ paddingRight: 8 }}>
      <Text style={{ ...stylesDateSign, fontSize: 36 }}>
        {dayjs(date).format('DD')}
      </Text>
      <Text style={{ ...stylesDateSign, fontSize: 24 }}>
        {dayjs(date).format('MMM')}
      </Text>
    </Column>
  );
}

export function ActivityDate({ date }) {
  if (date.startDate !== date.endDate) {
    return (
      <>
        <DateSign date={date.startDate} />
        <Column>
          <Text style={{ paddingRight: 8 }}>–</Text>
        </Column>
        <DateSign date={date.endDate} />
      </>
    );
  }
  return <DateSign date={date.startDate} />;
}

export function ActivityDates({ activity, currentHost, centered = false }) {
  if (!activity) {
    return null;
  }

  const futureDates = activity.datesAndTimes.filter((date) =>
    dayjs(date.endDate).isAfter(yesterday)
  );

  if (!futureDates || futureDates.length === 0) {
    return null;
  }

  const length = futureDates?.length;

  return (
    <Row
      style={{
        margin: centered ? '0 auto' : 0,
        padding: '12px',
        textAlign: centered ? 'center' : 'left',
        width: 'auto',
      }}
    >
      {length < 4
        ? futureDates.map((date) => (
            <ActivityDate key={date.startDate + date.startTime} date={date} />
          ))
        : futureDates
            .filter((d, i) => i < 3)
            .map((date) => (
              <ActivityDate key={date.startDate + date.startTime} date={date} />
            ))}
      <Column>
        <Text>{length > 3 && '+' + (length - 3).toString()}</Text>
      </Column>
    </Row>
  );
}

export default function EmailPreview({ currentHost, email }) {
  const [tc] = useTranslation('common');
  const [t] = useTranslation('admin');

  if (!currentHost || !email) {
    return null;
  }

  const { appeal, body, footer, items, subject } = email;
  const activities = items?.activities;
  const works = items?.works;

  const { host, logo, settings } = currentHost;

  return (
    <Html style={{ backgroundColor: 'transparent' }}>
      <Head />
      <Body style={{ backgroundColor: 'transparent' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
          <Link href={`https://${host}/newsletters/[newsletter-id]`}>
            <Text
              style={{
                color: '#0f64c0',
                fontSize: '12px',
                margin: '0 0 8px',
                textAlign: 'center',
              }}
            >
              {t('newsletter.labels.browserlink')}
              {/* Browser */}
            </Text>
          </Link>

          {logo ? (
            <Img
              alt={settings?.name}
              height="180px"
              src={logo}
              style={{ height: '180px', margin: '48px auto' }}
            />
          ) : (
            <Heading
              as="h1"
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                margin: '48px auto',
                textAlign: 'center',
              }}
            >
              {settings?.name}
            </Heading>
          )}

          {appeal && appeal.length > 1 && (
            <Text style={{ fontSize: 18 }}>{`${appeal} [username],`}</Text>
          )}

          {body.map((content) =>
            content?.type === 'image' && content?.value?.src ? (
              <Section key={content.id} style={{ marginBottom: 24 }}>
                <Img
                  style={{ margin: '24px auto', maxWidth: '456px' }}
                  src={content?.value?.src}
                  alt={subject}
                  height="auto"
                />
              </Section>
            ) : content?.type === 'text' && content?.value?.html ? (
              <Text style={{ fontSize: 18, marginBottom: 24 }}>
                {parseHtml(content.value.html)}
              </Text>
            ) : content?.type === 'divider' ? (
              <Hr style={{ margin: '48px 0' }} />
            ) : null
          )}

          {items && activities && (
            <>
              <Hr />
              {activities?.map((activity) => (
                <Section key={activity._id} style={{ marginBottom: 24 }}>
                  <Link
                    href={`https://${activity.host}/activities/${activity._id}`}
                    style={{ color: '#0f64c0' }}
                  >
                    <Heading
                      as="h3"
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        marginBottom: 8,
                        textAlign: 'center',
                      }}
                    >
                      {activity?.title}
                    </Heading>
                  </Link>
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 0,
                      marginBottom: 32,
                      textAlign: 'center',
                    }}
                  >
                    {activity?.subTitle}
                  </Text>

                  {(activity.images || activity.imageUrl) && (
                    <Link
                      href={`https://${activity.host}/activities/${activity._id}`}
                    >
                      <Img
                        src={
                          (activity.images && activity.images[0]) ||
                          activity.imageUrl
                        }
                        width="100%"
                        height="auto"
                        style={{ marginBottom: 12 }}
                      />
                    </Link>
                  )}
                  <ActivityDates
                    activity={activity}
                    centered
                    currentHost={currentHost}
                  />
                  <Text style={{ fontSize: 16 }}>
                    {activity?.longDescription &&
                      stripAndShorten(activity.longDescription)}
                  </Text>
                  <Text style={{ marginBottom: 12, textAlign: 'right' }}>
                    <Button
                      href={`https://${activity.host}/activities/${activity._id}`}
                      style={{
                        color: '#0f64c0',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {tc('actions.entryPage')}
                      {/* Visit */}
                    </Button>
                  </Text>
                  <Hr />
                </Section>
              ))}
            </>
          )}

          {items && works && (
            <>
              <Hr />
              {works?.map((work) => (
                <Section key={work._id} style={{ marginBottom: 24 }}>
                  <Link
                    href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                    style={{ color: '#0f64c0' }}
                  >
                    <Heading
                      as="h3"
                      style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        marginBottom: 8,
                        textAlign: 'center',
                      }}
                    >
                      {work?.title}
                    </Heading>
                  </Link>
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 0,
                      marginBottom: 32,
                      textAlign: 'center',
                    }}
                  >
                    {work?.shortDescription}
                  </Text>
                  {work.images && (
                    <Link
                      href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                    >
                      <Img
                        src={work.images && work.images[0]}
                        width="100%"
                        height="auto"
                        style={{ marginBottom: 12 }}
                      />
                    </Link>
                  )}
                  <Text style={{ fontSize: 16 }}>
                    {work?.longDescription &&
                      stripAndShorten(work.longDescription)}{' '}
                  </Text>
                  <Text style={{ marginBottom: 12, textAlign: 'right' }}>
                    <Button
                      href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                      style={{
                        color: '#0f64c0',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      {tc('actions.entryPage')}
                      {/* Visit */}
                    </Button>
                  </Text>
                  <Hr />
                </Section>
              ))}
            </>
          )}

          <Section
            style={{
              maxWidth: '456px',
              padding: '24px 0',
              textAlign: 'center',
            }}
          >
            {footer && footer.length > 0 && (
              <Container style={{ color: '#424242' }}>
                {parseHtml(footer)}
              </Container>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
