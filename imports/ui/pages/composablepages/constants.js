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
      kind: 'line', // or space
      height: 10, // only for space
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

export const getGridTemplateColumns = (gridType, isDesktop = true) => {
  if (!isDesktop) {
    return '1fr';
  }

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

const midRangeColumns = ['1+1', '1+2', '2+1', '1+1+1'];

export const getResponsiveGridColumns = (
  gridType,
  isDesktop = true,
  isMobile = false
) => {
  if (isMobile) {
    return '1fr';
  }
  if (isDesktop) {
    return getGridTemplateColumns(gridType);
  }

  return midRangeColumns.includes(gridType) ? 'repeat(2, 1fr)' : '1fr';
};
