type SpaceScale = {
  [key: number]: string;
};

export const spaceScale: SpaceScale = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
};

type BorderRadiusScale = {
  [key: string]: string;
};

export const borderRadiusScale: BorderRadiusScale = {
  '0': '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1.25rem',
  xl: '2rem',
};

export const getSpacing = (value: string | number): string => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return spaceScale[0];
  }

  if (Number(value)) {
    return spaceScale[value as keyof typeof spaceScale];
  }
  return spaceScale[0];
};

export const xToRem = (x: any) => {
  if (!x || typeof Number(x) !== 'number') {
    return 'none';
  }
  return `${x * 0.25}rem`;
};

export const getColor = (color: string) => {
  const colorParts = color?.split('.');
  if (!colorParts || colorParts.length !== 2) {
    return color;
  }

  return colorParts
    ? `var(--chakra-colors-${colorParts[0]}-${colorParts[1]})`
    : 'gray.900';
};

export const getPropStyles = (props: any) => {
  const styles = {
    ...(props.bg && {
      backgroundColor: getColor(props.bg),
    }),
    ...(props.borderRadius && {
      borderRadius:
        borderRadiusScale[
          props.borderRadius as keyof typeof borderRadiusScale
        ],
    }),
    ...(props.color && {
      color: getColor(props.color),
    }),
    ...(props.cursor && {
      cursor: props.cursor,
    }),
    ...(props.h && {
      height: props.h,
    }),
    ...(props.flex && {
      flex: props.flex,
    }),
    ...(props.maxH && {
      maxHeight: props.maxH,
    }),
    ...(props.maxW && {
      maxWidth: props.maxW,
    }),
    ...(props.w && {
      width: props.w,
    }),
    ...(props.pl && {
      paddingInlineStart: xToRem(props.pl),
    }),
    ...(props.pr && {
      paddingInlineEnd: xToRem(props.pr),
    }),
    ...(props.px && {
      paddingInline: xToRem(props.px),
    }),
    ...(props.pt && {
      paddingTop: xToRem(props.pt),
    }),
    ...(props.pb && {
      paddingBottom: xToRem(props.pb),
    }),
    ...(props.py && {
      paddingTop: xToRem(props.pt || props.py),
      paddingBottom: xToRem(props.pb || props.py),
    }),
    ...(props.p && {
      padding: xToRem(props.p),
    }),
    ...(props.mx && {
      marginInline: xToRem(props.mx),
      marginInlineStart: xToRem(props.ml),
      marginInlineEnd: xToRem(props.mr),
    }),
    ...(props.mt && {
      marginTop: xToRem(props.mt),
    }),
    ...(props.mb && {
      marginBottom: xToRem(props.mb),
    }),
    ...(props.my && {
      marginTop: xToRem(props.my),
      marginBottom: xToRem(props.my),
    }),
    ...(props.m && {
      margin: xToRem(props.m),
    }),
    ...(props._hover && {
      ':hover': {
        ...props.hover,
      },
    }),
    ...(props._focus && {
      ':focus': {
        ...props._focus,
      },
    }),
    ...(props._active && {
      ':active': {
        ...props._active,
      },
    }),
  };

  return styles;
};
