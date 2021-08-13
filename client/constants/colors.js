const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

function getHslValuesFromLength(length) {
  if (typeof length !== 'number') {
    return null;
  }

  const saturation = '75%';
  const lightness = '40%';

  const colorValues = [];
  const share = Math.round(360 / length);
  for (i = 0; i < length; i++) {
    colorValues.push(
      `hsl(${share * (i + 1) - share / 2}, ${saturation}, ${lightness})`
    );
  }

  return colorValues;
}

export { getHslValuesFromLength };

export default colors;
