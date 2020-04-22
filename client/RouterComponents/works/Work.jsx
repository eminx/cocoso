import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd/lib';

import { UserContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';

import { parseTitle } from '../../functions';

class Work extends PureComponent {
  state = {
    work: null,
    isLoading: true
  };

  componentDidMount() {
    this.getWork();
  }

  getWork = () => {
    this.setState({ isLoading: true });
    const { match } = this.props;
    const workId = match.params.workId;
    const username = match.params.username;

    console.log(match, workId, username);

    Meteor.call('getWork', workId, username, (error, respond) => {
      if (error) {
        console.log(error);
        return;
      }
      this.setState({
        work: respond,
        isLoading: false
      });
    });
  };

  render() {
    const { work, isLoading } = this.state;

    if (!work || isLoading) {
      return <Loader />;
    }

    const author =
      work.authorFirstName && work.authorLastName
        ? work.authorFirstName + ' ' + work.authorLastName
        : work.authorUsername;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col lg={6}>
            <h2 style={{ marginBottom: 0 }}>{work.title}</h2>
            <h4 style={{ fontWeight: 300 }}>{author}</h4>
            <p>
              <b>{work.shortDescription}</b>
            </p>
          </Col>

          <Col lg={12}>
            <div style={{ paddingBottom: 12 }}>
              <img
                width="100%"
                height="100%"
                alt={work.title}
                src={work.imageUrl}
              />
            </div>
          </Col>

          <Col lg={6}>
            <div dangerouslySetInnerHTML={{ __html: work.description }} />
          </Col>
        </Row>
      </div>
    );
  }
}

Work.contextType = UserContext;

export default Work;
