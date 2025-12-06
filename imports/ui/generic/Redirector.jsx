import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Redirector({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [to]);

  return null;
}
