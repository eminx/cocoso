import React from 'react';
import { Navigate } from 'react-router';

export default function Redirector({ to }) {
  return <Navigate to={to} />;
}
