import React from 'react';
import Nodal from '../UIComponents/Nodal';

class Home extends React.Component {
  state = {subID: 1};

  render() {
    return (
      <Nodal push={this.props.history.push} images={this.props.imagesArray} gatherings={this.props.gatheringsList} subID={this.state.subID} />
    )
  }
}

export default Home;