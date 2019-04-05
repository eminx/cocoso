const colors = {
  veryLightRed: '#FBD5D0',
  primaryRed: '#EA3924'
};

const skogen = {
  primary: colors.primaryRed,
  secondary: colors.veryLightRed
};

const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

const editorFormats = ['bold', 'italic', 'underline', 'list', 'link', 'bullet'];

export { colors, skogen, editorModules, editorFormats };
