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
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import truncate from 'html-truncate';

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

export function ActivityDates({ activity, centered = false }) {
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

const getTitleStyle = (theme) => ({
  color: `hsl(${theme?.hue || 288}deg, 80%, 40%)`,
  fontSize: 36,
  fontWeight: 'bold',
  lineHeight: 1.4,
  marginBottom: 4,
  marginTop: 12,
  textAlign: 'center',
  textShadow: 'rgb(255, 255, 255) 1px 1px 1px',
});

const getSubTitleStyle = (theme) => ({
  color: `hsl(${theme?.hue || 288}deg, 60%, 28%)`,
  fontSize: 20,
  marginTop: 0,
  marginBottom: 32,
  textAlign: 'center',
  textShadow: 'rgb(255, 255, 255) 1px 1px 1px',
});

const getButtonStyle = (theme) => ({
  backgroundColor: `hsl(${theme?.hue || 288}deg, 80%, 40%)`,
  border: `1px solid`,
  borderColor: `hsl(${theme?.hue || 288}deg, 80%, 90%)`,
  borderRadius: theme?.body?.borderRadius,
  color: `hsl(${theme?.hue || 288}deg, 80%, 95%)`,
  fontWeight: 'bold',
  fontSize: 18,
  margin: '12px auto',
  padding: '12px 16px',
  textAlign: 'center',
});

const imageStyle = {
  margin: '24px auto',
  width: '100%',
};

const hrStyle = {
  borderColor: '#252525',
  margin: '36px 0',
};

const maxChCount = 360;

export default function EmailPreview({ currentHost, email }) {
  const [tc] = useTranslation('common');
  const [t] = useTranslation('admin');

  if (!currentHost || !email) {
    return null;
  }

  const { appeal, body, footer, items, subject } = email;
  const activities = items?.activities;
  const works = items?.works;

  const { host, logo, settings, theme } = currentHost;

  const buttonStyle = getButtonStyle(theme);
  const subTitleStyle = getSubTitleStyle(theme);
  const titleStyle = getTitleStyle(theme);

  const renderBody = () => {
    const { body } = email;
    if (!body) return null;

    if (typeof body === 'string') {
      return (
        <Container>
          <Section style={{ marginBottom: 12 }}>
            {email.imageUrl && (
              <Img
                alt={subject}
                height="auto"
                src={email.imageUrl}
                style={imageStyle}
              />
            )}
            <div style={{ fontSize: 16 }}>
              {HTMLReactParser(DOMPurify.sanitize(body))}
            </div>
          </Section>
        </Container>
      );
    }

    return body.map((content) =>
      content?.type === 'image' && content?.value?.src ? (
        <Container>
          <Section key={content.id} style={{ marginBottom: 24 }}>
            <Img
              alt={subject}
              height="auto"
              src={content?.value?.src}
              style={imageStyle}
            />
          </Section>
        </Container>
      ) : content?.type === 'text' && content?.value?.html ? (
        <Container>
          <Section key={content.id} style={{ fontSize: 16, marginBottom: 24 }}>
            {HTMLReactParser(DOMPurify.sanitize(content.value.html))}
          </Section>
        </Container>
      ) : content?.type === 'divider' ? (
        <Hr key={content.id} style={hrStyle} />
      ) : null
    );
  };

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: theme?.body?.backgroundColor,
          padding: '18px',
        }}
      >
        <Container>
          <Link href={`https://${host}/newsletters/[newsletter-id]`}>
            <Text
              style={{
                color: '#044386',
                fontSize: '13px',
                margin: '0 0 8px',
                textAlign: 'center',
              }}
            >
              {t('newsletter.labels.browserlink')}
            </Text>
          </Link>

          {logo ? (
            <Img
              alt={settings?.name}
              height="150px"
              src={logo}
              style={{
                height: 'auto',
                margin: '24px auto',
                width: '80%',
                maxWidth: 360,
                objectFit: 'contain',
              }}
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

          {renderBody()}

          <Hr style={hrStyle} />

          {activities?.map((activity) => (
            <Container>
              <Section key={activity._id} style={{ marginBottom: 24 }}>
                <Link
                  href={`https://${activity.host}/activities/${activity._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <Heading as="h2" style={titleStyle}>
                    {activity?.title}
                  </Heading>
                </Link>
                <Text style={subTitleStyle}>{activity?.subTitle}</Text>

                {(activity.images || activity.imageUrl) && (
                  <Link
                    href={`https://${activity.host}/activities/${activity._id}`}
                  >
                    <Img
                      alt={activity?.title}
                      height="auto"
                      src={
                        (activity.images && activity.images[0]) ||
                        activity.imageUrl
                      }
                      style={imageStyle}
                      width="100%"
                    />
                  </Link>
                )}
                <ActivityDates
                  activity={activity}
                  centered
                  currentHost={currentHost}
                />
                <Container>
                  {activity?.longDescription &&
                    HTMLReactParser(
                      truncate(
                        DOMPurify.sanitize(activity.longDescription),
                        maxChCount
                      )
                    )}
                </Container>
                <Text style={{ textAlign: 'center' }}>
                  <Button
                    href={`https://${activity.host}/activities/${activity._id}`}
                    style={buttonStyle}
                  >
                    {tc('actions.entryPage')}
                  </Button>
                </Text>

                <Hr style={hrStyle} />
              </Section>
            </Container>
          ))}

          {works?.map((work) => (
            <Container>
              <Section key={work._id} style={{ marginBottom: 24 }}>
                <Link
                  href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                  style={{ color: '#0f64c0' }}
                >
                  <Heading as="h2" style={titleStyle}>
                    {work?.title}
                  </Heading>
                </Link>
                <Text style={subTitleStyle}>{work?.shortDescription}</Text>
                {work.images && (
                  <Link
                    href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                  >
                    <Img
                      alt={work?.title}
                      height="auto"
                      src={work.images && work.images[0]}
                      style={imageStyle}
                      width="100%"
                    />
                  </Link>
                )}
                <Container>
                  {work?.longDescription &&
                    HTMLReactParser(
                      truncate(
                        DOMPurify.sanitize(work.longDescription),
                        maxChCount
                      )
                    )}
                </Container>
                <Text style={{ textAlign: 'center' }}>
                  <Button
                    href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}
                    style={buttonStyle}
                  >
                    {tc('actions.entryPage')}
                  </Button>
                </Text>

                <Hr style={hrStyle} />
              </Section>
            </Container>
          ))}

          <Section
            style={{
              width: 280,
              margin: '0 auto',
              padding: '24px 0',
              textAlign: 'center',
            }}
          >
            {footer && footer.length > 0 && (
              <Container style={{ color: '#424242' }}>
                {HTMLReactParser(DOMPurify.sanitize(footer))}
              </Container>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
