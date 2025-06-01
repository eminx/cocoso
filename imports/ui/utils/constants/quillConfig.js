const editorModules = {
  toolbar: [
    // [{ header: 1 }, { header: 2 }, { header: 3 }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const editorFormats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'color',
];

export { editorModules, editorFormats };
