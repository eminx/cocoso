import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Anchor, Box, Button, Tabs, Tab, Text } from 'grommet';

import Personal from './Personal';
import ListMenu from '../../UIComponents/ListMenu';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { AuthContainer } from '../../account-manager';
import { message } from '../../UIComponents/message';
import { userMenu } from '../../constants/general';

const personalModel = {
  firstName: '',
  lastName: '',
  bio: '',
  city: '',
};

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    personal: personalModel,
    bio: '',
  };

  componentDidMount() {
    this.setInitialPersonalInfo();
  }

  setInitialPersonalInfo = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      personal: {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      },
      bio: currentUser.bio || '',
    });
  };

  handleFormChange = (formValues) => {
    this.setState({
      personal: formValues,
    });
  };

  handleQuillChange = (bio) => {
    this.setState({
      bio,
    });
  };

  handleSubmit = () => {
    const { personal, bio } = this.state;
    this.setState({
      isSaving: true,
    });

    const values = {
      ...personal,
      bio,
    };
    Meteor.call('saveUserInfo', values, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
      } else {
        message.success('Your data is successfully saved');
        this.setState({
          isSaving: false,
        });
      }
    });
  };

  deleteAccount = () => {
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  logout = () => {
    Meteor.logout();
  };

  render() {
    const { currentUser, history } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    const { personal, bio, isDeleteModalOn } = this.state;

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading={currentUser ? 'Personal Info' : 'Join'}
        titleCentered
        leftContent={
          <Fragment>
            <ListMenu list={userMenu}>
              {(datum) => (
                <Anchor
                  onClick={() => history.push(datum.value)}
                  key={datum.value}
                  label={
                    <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                      {datum.label}
                    </Text>
                  }
                />
              )}
            </ListMenu>
          </Fragment>
        }
      >
        {currentUser ? (
          <Personal
            formValues={personal}
            bio={bio}
            onQuillChange={this.handleQuillChange}
            onFormChange={this.handleFormChange}
            onSubmit={this.handleSubmit}
          />
        ) : (
          <Box width="medium" alignSelf="center">
            <AuthContainer />
            <Blaze template="loginButtons" />
          </Box>
        )}

        {currentUser && (
          <Box alignSelf="center" margin="large">
            <Button
              onClick={() => this.logout()}
              size="small"
              label="Log out"
            />
          </Box>
        )}

        {currentUser && (
          <Box alignSelf="center" margin="large">
            <Button
              onClick={() => this.setState({ isDeleteModalOn: true })}
              color="status-critical"
              plain
              size="small"
              label="Delete Account"
            />
          </Box>
        )}

        <ConfirmModal
          visible={isDeleteModalOn}
          title="Are you sure?"
          confirmText="Confirm Deletion"
          onConfirm={this.deleteAccount}
          onCancel={() => this.setState({ isDeleteModalOn: false })}
        >
          <Text>
            You are about to permanently delete your user information. This is
            an irreversible action.
          </Text>
        </ConfirmModal>
      </Template>
    );
  }
}

export default Profile;
