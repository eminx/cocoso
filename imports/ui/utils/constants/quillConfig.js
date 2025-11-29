export const sizeOptions = [
  { label: 'Small', value: '12px' },
  { label: 'Medium', value: '16px' },
  { label: 'Large', value: '20px' },
  { label: 'X-large', value: '32px' },
  { label: 'Huge', value: '48px' },
];

export const editorModules = {
  toolbar: [
    // [{ header: 1 }, { header: 2 }, { header: 3 }],
    [
      {
        // size: sizeOptions.map((opt) => opt.label),
        size: ['12px', false, '20px', '32px', '48px'],
      },
    ],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    // ['image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const editorFormats = [
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
