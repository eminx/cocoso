const editorModules = {
  toolbar: [
    // [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const editorFormats = ['align', 'bold', 'bullet', 'italic', 'link', 'list', 'underline'];

export { editorModules, editorFormats };
