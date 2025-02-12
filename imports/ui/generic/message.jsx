import React from 'react';
import toast from 'react-hot-toast';

export const timeOutTime = 5000;

export const message = {
  success: (text, duration = timeOutTime) => toast.success(text, { duration }),
  error: (text, duration = timeOutTime) => toast.error(text, { duration }),
  info: (text, duration = timeOutTime) => toast(text, { duration }),
};
