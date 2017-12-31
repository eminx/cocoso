import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

class Nodal extends React.Component { 
  render(){
	  return (
	  	<div>
	  		<Blaze template="loginButtons" />
       	<p>Your subscription ID is: {this.props.subID} </p>
       	<button onClick={this.props.incrementSubId}>Click Me To Increment</button>
     </div>
    )
	}
}

export default Nodal;