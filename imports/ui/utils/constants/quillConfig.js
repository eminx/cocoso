const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const editorFormats = ['bold', 'italic', 'underline', 'list', 'link', 'bullet'];

export { editorModules, editorFormats };
