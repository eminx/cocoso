import loadable from '@loadable/component';

const NewEntryHandler = loadable(
  () => import('/imports/ui/forms/NewEntryHandler')
);

export default NewEntryHandler;
