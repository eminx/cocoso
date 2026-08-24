import loadable from '@loadable/component';

const EditEntryHandler = loadable(
  () => import('/imports/ui/forms/EditEntryHandler')
);

export default EditEntryHandler;
