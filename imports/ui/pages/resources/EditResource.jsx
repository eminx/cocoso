import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';

import Template from '../../components/Template';

function EditResourcePage({ resourceId }) {

  return (
    <Template>
      <h1>Edit Resource ({resourceId})</h1>
      <Link to={`/resources/${resourceId}`}>Back to resource</Link>
    </Template>
  );
}

export default EditResource = withTracker((props) => {
  const resourceId = props.match.params.id;

  return {
    resourceId
  };
})(EditResourcePage);