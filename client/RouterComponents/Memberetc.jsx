import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

class Memberetc extends React.Component {
 
  render() {
    return (
    	<div style={{padding: 24}}>
				<h1>Membership at Noden</h1>
				<div style={{height: 150, padding: 24}}>
					<Blaze template="loginButtons" />
				</div>
				<iframe frameBorder="0" width="100%" height="900" src="https://us16.campaign-archive.com/?u=a8e7ebfe9fee3c7d73e2a99a5&id=bc730875f5" />
    	</div>
    )
  }
}

export default Memberetc;