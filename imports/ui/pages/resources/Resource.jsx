import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';

import Template from '../../components/Template';

function ResourcePage({ resourceId }) {

  return (
    <Template>
      <h1>Resource ({resourceId})</h1>
      <Link to={`/resources/${resourceId}/edit`}>Edit resource</Link>
    </Template>
  );
}

export default Resource = withTracker((props) => {
  const resourceId = props.match.params.id;

  return {
    resourceId
  };
})(ResourcePage);
