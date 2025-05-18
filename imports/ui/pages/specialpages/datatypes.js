export const contentTypes = [
  {
    value: 'text',
    label: 'Text',
  },
  {
    value: 'image',
    label: 'Image',
  },
  {
    value: 'imageSlider',
    label: 'Image Slider',
  },
  {
    value: 'imageBanner',
    label: 'Image Banner',
  },
  {
    value: 'videoClip',
    label: 'Video Clip',
  },
];

export const emtptySpecialPage = {
  title: '',
  contentRows: [
    {
      gridType: '3',
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
