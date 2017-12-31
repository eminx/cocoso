import React from 'react';
import Nodal from '../Nodal';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {subID: 1};
  }
 
  incrementSubID = () => {
    this.setState({subID: this.state.subID + 1});
  }
 
  render() {
    return (
      <Nodal subID={this.state.subID} incrementSubId={this.incrementSubID} />
    )
  }
}

export default Home;