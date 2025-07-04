import { Trans } from 'react-i18next';

export const contentTypes = [
  {
    type: 'button',
    value: {
      linkValue: '',
      isExternal: false,
      label: 'Click me',
    },
  },
  {
    type: 'divider',
    value: {
      kind: 'line', // or empty-space
      height: 10, // only for empty-space
    },
  },
  {
    type: 'image',
    value: {
      src: '',
      isLink: false,
      linkValue: '',
    },
  },
  {
    type: 'image-slider',
    value: {
      images: [],
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
      src: '',
    },
  },
];

export const emtptyComposablePage = {
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

export const getGridTemplateColumns = (gridType) => {
  switch (gridType) {
    case '1+1':
      return 'repeat(2, 1fr)';
    case '1+1+1':
      return 'repeat(3, 1fr)';
    case '1+2':
      return '1fr 2fr';
    case '2+1':
      return '2fr 1fr';
    default:
      return '1fr';
  }
};

export const getResponsiveGridColumns = (gridType) => ({
  base: '1fr',
  md: ['1+1', '1+2', '2+1', '1+1+1'].includes(gridType)
    ? 'repeat(2, 1fr)'
    : '1fr',
  lg: getGridTemplateColumns(gridType),
});
