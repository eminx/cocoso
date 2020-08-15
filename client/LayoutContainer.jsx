import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Anchor, Heading, Image, Paragraph, Footer } from 'grommet';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import Loader from './UIComponents/Loader';

export const StateContext = React.createContext(null);

import UserPopup from './UIComponents/UserPopup';
import NotificationsPopup from './UIComponents/NotificationsPopup';

const menu = [
  {
    label: 'Offers',
    route: '/works',
  },
  {
    label: 'Calendar',
    route: '/calendar',
  },
  {
    label: 'Processes',
    route: '/processes',
  },
  {
    label: 'Info',
    route: `/page/about`,
  },
];

const LayoutPage = ({
  currentUser,
  currentHost,
  userLoading,
  hostLoading,
  history,
  children,
}) => {
  // const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(
  //   false
  // );

  if (!currentHost) {
    return <Loader />;
  }

  const headerProps = {
    currentUser,
    history,
    title: 'Cic Network',
  };

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find(
      (membership) => membership.host === location.host
    );

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent =
    (role && role === 'admin') ||
    role === 'contributor' ||
    (currentUser && currentUser.isSuperAdmin);

  return (
    <StateContext.Provider
      value={{
        currentUser,
        userLoading,
        currentHost,
        role,
        canCreateContent,
      }}
    >
      <Box className="main-viewport" justify="center" fill background="#eee">
        <Box width={{ max: '1280px' }} alignSelf="center" fill>
          <Header {...headerProps} />
          <Box>{children}</Box>
          {/* <FooterInfo settings={settings} /> */}
        </Box>
      </Box>
    </StateContext.Provider>
  );
};

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700,
};

const Header = ({ currentUser, title, history }) => {
  const UserStuff = () => (
    <Box justify="end" direction="row" alignContent="center">
      {currentUser && (
        <NotificationsPopup notifications={currentUser.notifications} />
      )}
      <UserPopup currentUser={currentUser} />
    </Box>
  );

  return (
    <ScreenClassRender
      render={(screenClass) => {
        const large = ['lg', 'xl', 'xxl'].includes(screenClass);

        return (
          <Container fluid style={{ width: '100%' }}>
            <Row>
              <Col lg={3}>
                <Box direction="row" justify="between" align="center">
                  <Link to="/">
                    <Box width="60px" height="30px" margin={{ top: 'small' }}>
                      <Image
                        fit="contain"
                        src="https://xyrden.s3.eu-central-1.amazonaws.com/CIC-Logo.png"
                        className="header-logo"
                        elevation="medium"
                      />
                    </Box>
                  </Link>
                  {!large && <UserStuff />}
                </Box>
              </Col>
              <Col lg={6}>
                <Box
                  pad="small"
                  justify="center"
                  direction="row"
                  flex={{ shrink: 0 }}
                  alignSelf="center"
                >
                  {menu.map((item) => (
                    <Box pad="small" key={item.label}>
                      <Anchor
                        onClick={() => history.push(item.route)}
                        label={item.label}
                      />
                    </Box>
                  ))}
                </Box>
              </Col>
              <Col lg={3}>{large && <UserStuff />}</Col>
            </Row>
          </Container>
        );
      }}
    />
  );
};

const FooterInfo = ({ currentHost }) =>
  currentHost && (
    <Footer pad="medium" direction="row" justify="center">
      <Box alignSelf="center">
        <Heading level={4} style={boldBabe}>
          {currentHost.name}
        </Heading>
        <Paragraph>
          {currentHost.address}, {currentHost.city}
        </Paragraph>
        <Paragraph>
          <Anchor href={`mailto:${currentHost.email}`}>
            {currentHost.email}
          </Anchor>
        </Paragraph>
      </Box>
    </Footer>
  );

export default withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !meSub.ready();

  const hostSub = Meteor.subscribe('currentHost');
  const currentHost = Hosts ? Hosts.findOne() : null;
  const hostLoading = !hostSub.ready();

  return {
    currentUser,
    currentHost,
    userLoading,
    hostLoading,
  };
})(LayoutPage);
