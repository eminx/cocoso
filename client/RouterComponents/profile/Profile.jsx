import React, { Fragment } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { message } from 'antd/lib';

import { Anchor, Text, Box, Button } from 'grommet';

import Personal from './Personal';
import ListMenu from '../../UIComponents/ListMenu';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';

const personalModel = {
  firstName: '',
  lastName: '',
  bio: '',
  city: ''
};

const menuRoutes = [
  { label: 'Profile', value: '/my-profile' },
  { label: 'Works', value: 'my-works' }
];

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    personal: personalModel,
    bio: ''
  };

  componentDidMount() {
    // this.getMyWorks();
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
        lastName: currentUser.lastName || ''
      },
      bio: currentUser.bio || ''
    });
  };

  getMyWorks = () => {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        console.log(error);
        // message.error(error.reason);
        return;
      }
      this.setState({
        myWorks: respond
      });
    });
  };

  handleFormChange = formValues => {
    this.setState({
      personal: formValues
    });
  };

  handleQuillChange = bio => {
    this.setState({
      bio
    });
  };

  handleSubmit = () => {
    const { personal, bio } = this.state;
    this.setState({
      isSaving: true
    });

    const values = {
      ...personal,
      bio
    };
    Meteor.call('saveUserInfo', values, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
      } else {
        message.success('Your data is successfully saved');
        this.setState({
          isSaving: false
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

  render() {
    const { currentUser, history } = this.props;
    const { personal, bio, isDeleteModalOn } = this.state;

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading="Personal Information"
        leftContent={
          <Fragment>
            <ListMenu list={menuRoutes}>
              {datum => (
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
            {currentUser && (
              <Box pad="medium">
                <Blaze template="loginButtons" />
              </Box>
            )}
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
          <Box pad="medium">
            <Blaze template="loginButtons" />
          </Box>
        )}

        {currentUser && (
          <Box alignSelf="center">
            <Button
              onClick={() => this.setState({ isDeleteModalOn: true })}
              color="status-critical"
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
