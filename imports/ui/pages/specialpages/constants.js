export const contentTypes = [
  {
    type: 'image',
    value: {
      src: '',
      alt: '',
    },
  },
  {
    type: 'image-slider',
    value: {
      images: [],
    },
  },
  {
    type: 'image-with-button',
    value: {
      imageSrc: '',
      altText: '',
      buttonLabel: '',
      buttonLink: '',
    },
  },
  {
    type: 'link',
    value: {
      kind: 'button', // link, button
      isExternal: false,
      href: '',
    },
  },
  {
    type: 'text',
    value: {
      html: '<p>Text</p>',
    },
  },
  {
    type: 'video',
    value: {
      videoSrc: '',
      altText: '',
    },
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
          value: {
            html: '<p>Text</p>',
          },
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
    value: '1+1+1',
    label: '1+1+1',
    columns: [[], [], []],
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
];
