import toast from 'react-hot-toast';

export const timeOutTime = 5000;

export const message = {
  success: (text: string, duration: number = timeOutTime) => toast.success(text, { duration }),
  error: (text: string, duration: number = timeOutTime) => toast.error(text, { duration }),
  info: (text: string, duration: number = timeOutTime) => toast(text, { duration }),
};
