import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Image } from '@chakra-ui/react';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';

import Menu from './Menu';
import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';

function Header() {
  const { currentHost, currentUser } = useContext(StateContext);

  return (
    <Box mb="4">
      <ScreenClassRender
        render={(screenClass) => {
          const isMobile = ['xs'].includes(screenClass);

          return (
            <Container fluid style={{ width: '100%', padding: 0, zIndex: 9 }}>
              <Row
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 12,
                  marginTop: 12,
                  alignItems: 'flex-start',
                }}
              >
                <Col xs={3} style={{ paddingLeft: 0 }}>
                  <Link to="/">
                    <Box w="120px" h="60px" ml="3">
                      <Image
                        fit="contain"
                        src={currentHost && currentHost.logo}
                        className="header-logo"
                      />
                    </Box>
                  </Link>
                </Col>
                <Col xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                  {!isMobile && (
                    <Menu currentHost={currentHost} isMobile={false} screenClass={screenClass} />
                  )}
                </Col>
                <Col xs={3} style={{ paddingRight: 0 }}>
                  <Flex justify="flex-end">
                    <UserPopup currentUser={currentUser} />
                  </Flex>
                </Col>
              </Row>
              {isMobile && <Menu currentHost={currentHost} isMobile />}
            </Container>
          );
        }}
      />
    </Box>
  );
}

export default Header;
