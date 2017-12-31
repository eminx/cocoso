import React from 'react';

class Nodal extends React.Component { 
  render(){
	  return (
	  	<div>
       <p>Your subscription ID is: {this.props.subID} </p>
       <button onClick={this.props.incrementSubId}>Click Me To Increment</button>
     </div>
    )
	}
}

export default Nodal;