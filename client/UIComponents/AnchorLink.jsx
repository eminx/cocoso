import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor } from 'grommet';

const AnchorLink = ({ to, children }) => (
  <Anchor as={() => <Link to={to}>{children}</Link>} />
);

export default AnchorLink;
