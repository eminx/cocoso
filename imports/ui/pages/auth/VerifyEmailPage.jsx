import React from 'react';

function VerifyEmailPage({ match }) {
  const { token } = match.params;

  return <>{token}</>;
}

export default VerifyEmailPage;
