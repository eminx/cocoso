import React from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

function shorten(str) {
  const strArray = str.split(/\s+/);
  return [...strArray.slice(0, 30)].join(' ') + '...';
}

function stripAndShorten(html) {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  const stripped = tmp.textContent || tmp.innerText || '';
  return shorten(stripped);
}

export default function EmailPreview({ currentHost, email, imageUrl }) {
  const [tc] = useTranslation('common');
  const [t] = useTranslation('admin');

  if (!email || !currentHost) {
    return null;
  }

  const { appeal, body, footer, image, items, subject } = email;
  const uploadableImageLocal = image?.uploadableImageLocal;
  const activities = items?.activities;
  const works = items?.works;

  const { host, logo, settings } = currentHost;
  const activitiesLabel =
    settings?.menu?.find((item) => item.name === 'activities')?.label || 'Activities';
  const worksLabel = settings?.menu?.find((item) => item.name === 'works')?.label || 'Works';

  const address = `${settings.address}, ${settings.city}, ${settings.country}`;

  return (
    <Html>
      <Head />
      <Body style={{ maxWidth: '480px', padding: 12 }}>
        <Link href={`https://${host}/newsletters/[newsletter-id]`}>
          <Text
            style={{ color: '#0f64c0', fontSize: '12px', margin: '0 0 8px', textAlign: 'center' }}
          >
            {t('newsletter.labels.browserlink')}
            {/* Browser */}
          </Text>
        </Link>
        <Container>
          <Img
            alt={settings?.name}
            height="50px"
            src={logo}
            style={{ height: '50px', margin: '8px auto 24px', width: 'auto' }}
            width="auto"
          />
        </Container>

        <Section style={{ marginBottom: 12 }}>
          {(imageUrl || uploadableImageLocal) && (
            <Img
              style={{ marginBottom: 24, maxWidth: '480px' }}
              src={imageUrl || uploadableImageLocal}
              alt={subject}
              width="100%"
              height="auto"
            />
          )}

          {body && <Text style={{ fontSize: 16 }}>{`${appeal} [username],`}</Text>}

          {body && <Text style={{ fontSize: 16 }}>{renderHTML(body)}</Text>}

          <Hr />
        </Section>

        {items && activities && (
          <>
            {activities && activities.length > 0 && (
              <Heading as="h2" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                {activitiesLabel}
              </Heading>
            )}

            {activities?.map((activity) => (
              <Section key={activity._id} style={{ marginBottom: 24 }}>
                <Link
                  href={`https://${host}/activities/${activity._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <Heading
                    as="h3"
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                    }}
                  >
                    {activity?.title}
                  </Heading>
                </Link>
                <Text style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
                  {activity?.subTitle}
                </Text>
                <Link href={`https://${host}/activities/${activity._id}`}>
                  <Img
                    src={activity?.imageUrl}
                    width="100%"
                    height="auto"
                    style={{ marginBottom: 12, maxWidth: '480px' }}
                  />
                </Link>
                <ActivityDates activity={activity} currentHost={currentHost} />
                <Text>
                  {activity?.longDescription && stripAndShorten(activity.longDescription)}
                </Text>
                <Text style={{ marginBottom: 12, textAlign: 'right' }}>
                  <Button
                    href={`https://${host}/activities/${activity._id}`}
                    style={{
                      color: '#0f64c0',
                      fontWeight: 'bold',
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
            {works && works.length > 0 && (
              <Heading as="h2" style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                {worksLabel}
              </Heading>
            )}
            {works?.map((work) => (
              <Section key={work._id} style={{ marginBottom: 24 }}>
                <Link
                  href={`https://${host}/@${work.authorUsername}/works/${work._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <Heading
                    as="h3"
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                    }}
                  >
                    {work?.title}
                  </Heading>
                </Link>
                <Text style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
                  {work?.shortDescription}
                </Text>
                {work.images && (
                  <Link href={`https://${host}/@${work.authorUsername}/works/${work._id}`}>
                    <Img
                      src={work.images[0]}
                      width="100%"
                      height="auto"
                      style={{ marginBottom: 12, maxWidth: '480px' }}
                    />
                  </Link>
                )}
                <Text>{work?.longDescription && stripAndShorten(work.longDescription)} </Text>
                <Text style={{ marginBottom: 12, textAlign: 'right' }}>
                  <Button
                    href={`https://${host}/@${work.authorUsername}/works/${work._id}`}
                    style={{
                      color: '#0f64c0',
                      fontWeight: 'bold',
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

        <Section style={{ maxWidth: '480px', textAlign: 'center' }}>
          <Heading as="h1" style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
            {settings?.name}
          </Heading>
          {footer && footer.length > 0 && (
            <Container style={{ color: '#424242' }}>
              <Text style={{ textAlign: 'center' }}>{renderHTML(footer)}</Text>
            </Container>
          )}

          <Container style={{ color: '#6b6b6b' }}>
            <Text style={{ margin: 0 }}>{address}</Text>
            <Text style={{ margin: 0 }}>{settings.email}</Text>
            <Link href={`https://${host}`} style={{ color: '#0f64c0', textAlign: 'center' }}>
              <Text>{host}</Text>
            </Link>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export function ActivityDates({ activity, currentHost }) {
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

export function ActivityDate({ currentHost, date }) {
  moment.locale(currentHost?.settings?.lang || 'en');

  return (
    <Column style={{ paddingRight: 8 }}>
      <Text style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
        {moment(date.startDate).format('DD')}
      </Text>
      <Text style={{ fontSize: '14px', margin: 0, marginTop: -4 }}>
        {moment(date.startDate).format('MMM')}
      </Text>
    </Column>
  );
}
