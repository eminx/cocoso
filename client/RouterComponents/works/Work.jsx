import React, { PureComponent } from 'react';
import { Box, Heading, Text } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import NiceSlider from '../../UIComponents/NiceSlider';

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
      <Template
        leftContent={
          <Box pad={{ bottom: 'medium' }}>
            <Heading pad="small" level={3}>
              {work.title}
            </Heading>
            <Text>{work.shortDescription}</Text>
          </Box>
        }
        rightContent={
          <Box
            pad={{
              top: 'medium',
              bottom: 'small'
            }}
          >
            <Text>{work.additionalInfo}</Text>
          </Box>
        }
      >
        <NiceSlider images={work.images} />
        <Box>
          <div dangerouslySetInnerHTML={{ __html: work.longDescription }} />
        </Box>
      </Template>
    );
  }
}

Work.contextType = UserContext;

export default Work;
