import React from 'react';
import Nodal from '../UIComponents/Nodal';

class Home extends React.Component {
  state = {subID: 1};
 
  render() {
    return (
      <Nodal subID={this.state.subID} />
    )
  }
}

export default Home;