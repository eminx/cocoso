import React from 'react';
import moment from 'moment';
import { Row, Radio, Col, Alert, Input, message, Divider } from 'antd/lib';
import Loader from '../../UIComponents/Loader';

class User extends React.PureComponent {
  render() {
    const { user } = this.props;
    return <div>{user && user.username}</div>;
  }
}

export default User;
