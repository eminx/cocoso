import toast from 'react-hot-toast';
import { atom } from 'jotai';

export const initialLoader = {
  isCreating: false,
  isUploadingImages: false,
  isSendingForm: false,
  isSuccess: false,
};

export const loaderAtom = atom({ ...initialLoader });

export const getLoaderProgress = (loaders) => {
  if (!loaders) {
    return 0;
  }
  if (loaders.isSuccess) {
    return 100;
  }
  if (loaders.isSendingForm) {
    return 80;
  }
  if (loaders.isUploadingImages) {
    return 40;
  }
  if (loaders.isCreating) {
    return 20;
  }
  return 0;
};

export const renderToasts = (loaders, tc, forEdit = false) => {
  if (!loaders) {
    return;
  }

  const options = { id: 'loader' };
  if (loaders.isSuccess) {
    toast.success(tc(`message.success.${forEdit ? 'update' : 'create'}`), {
      ...options,
      duration: 3000,
    });
    return;
  }
  if (loaders.isSendingForm) {
    toast.loading(tc('message.loading.sending'), options);
    return;
  }
  if (loaders.isUploadingImages) {
    toast.loading(tc('message.loading.uploading'), options);
    return;
  }
  if (loaders.isCreating) {
    toast.loading(tc('message.loading.creating'), options);
  }
};
