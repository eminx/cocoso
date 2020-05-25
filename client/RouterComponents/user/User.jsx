import React from 'react';

class User extends React.PureComponent {
  render() {
    const { user } = this.props;
    return <div>{user && user.username}</div>;
  }
}

export default User;
