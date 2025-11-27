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

export function ActivityDate({ date }) {
  return (
    <Column style={{ paddingRight: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
        {dayjs(date.startDate).format('DD')}
      </Text>
      <Text style={{ fontSize: 18, margin: 0, marginTop: -4 }}>
        {dayjs(date.startDate).format('MMM')}
      </Text>
    </Column>
  );
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
        width: 'auto',
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {length < 4
        ? futureDates.map((date) => (
            <ActivityDate key={date.startDate + date.endTime} date={date} />
          ))
        : futureDates
            .filter((d, i) => i < 3)
            .map((date) => (
              <ActivityDate
                key={date.startDate + date.endTime}
                currentHost={currentHost}
                date={date}
              />
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

  if (!email || !currentHost) {
    return null;
  }

  const { appeal, body, footer, items, subject } = email;
  const activities = items?.activities;
  const works = items?.works;

  const { host, logo, settings } = currentHost;
  const activitiesLabel =
    settings?.menu?.find((item) => item.name === 'activities')?.label ||
    'Activities';
  const worksLabel =
    settings?.menu?.find((item) => item.name === 'works')?.label || 'Works';

  const address = `${settings.address}, ${settings.city}, ${settings.country}`;

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
              height="50px"
              src={logo}
              style={{ height: '50px', margin: '0 auto' }}
            />
          ) : (
            <Heading
              as="h1"
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              {settings?.name}
            </Heading>
          )}

          {appeal && (
            <Text style={{ fontSize: 16 }}>{`${appeal} [username],`}</Text>
          )}

          {body.map((content) =>
            content?.type === 'image' && content?.value?.src ? (
              <Section key={content.id} style={{ marginBottom: 12 }}>
                <Img
                  style={{ margin: '24px auto', maxWidth: '456px' }}
                  src={content?.value?.src}
                  alt={subject}
                  height="auto"
                />
              </Section>
            ) : content?.type === 'text' && content?.value?.html ? (
              <Text style={{ fontSize: 16 }}>
                {parseHtml(content.value.html)}
              </Text>
            ) : content?.type === 'divider' ? (
              <Hr />
            ) : null
          )}

          {items && activities && (
            <>
              <Hr />
              {activities && activities.length > 0 && (
                <Heading
                  as="h2"
                  style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}
                >
                  {activitiesLabel}
                </Heading>
              )}

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
              {works && works.length > 0 && (
                <Heading
                  as="h2"
                  style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}
                >
                  {worksLabel}
                </Heading>
              )}
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

          <Section style={{ maxWidth: '456px', textAlign: 'center' }}>
            <Heading
              as="h1"
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {settings?.name}
            </Heading>
            {footer && footer.length > 0 && (
              <Container style={{ color: '#424242' }}>
                <Text style={{ textAlign: 'center' }}>{parseHtml(footer)}</Text>
              </Container>
            )}

            <Container style={{ color: '#6b6b6b' }}>
              <Text style={{ margin: 0 }}>{address}</Text>
              <Text style={{ margin: 0 }}>{settings.email}</Text>
              <Link
                href={`https://${host}`}
                style={{ color: '#0f64c0', textAlign: 'center' }}
              >
                <Text>{host}</Text>
              </Link>
            </Container>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
