export const contentTypes = [
  {
    type: 'text',
    content: 'Text',
  },
  {
    type: 'image',
    content: 'Image',
  },
  {
    type: 'image-slider',
    content: 'Image Slider',
  },
  {
    type: 'image-banner',
    content: 'Image Banner',
  },
  {
    type: 'video-clip',
    content: 'Video Clip',
  },
];

export const emtptySpecialPage = {
  title: '',
  contentRows: [
    {
      gridType: 'full',
      columns: [
        {
          type: 'text',
          content: '',
        },
      ],
    },
  ],
};

export const rowTypes = [
  {
    value: 'full',
    label: 'Full',
    columns: [[]],
  },
  {
    value: '1+1',
    label: '1+1',
    columns: [[], []],
  },
  {
    value: '1+2',
    label: '1+2',
    columns: [[], []],
  },
  {
    value: '2+1',
    label: '2+1',
    columns: [[], []],
  },
  {
    value: '1+1+1',
    label: '1+1+1',
    columns: [[], [], []],
  },
];
