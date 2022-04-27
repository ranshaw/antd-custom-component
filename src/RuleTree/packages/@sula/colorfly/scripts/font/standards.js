const standards = [
  { name: 'fz-xs', value: transToPx(12) },
  { name: 'lh-xs', value: transToPx(20) },
  { name: 'fz-sm', value: transToPx(13) },
  { name: 'lh-sm', value: transToPx(21) },
  { name: 'fz-base', value: transToPx(14) },
  { name: 'lh-base', value: transToPx(22) },
  { name: 'fz-md', value: transToPx(16) },
  { name: 'lh-md', value: transToPx(24) },
  { name: 'fz-lg', value: transToPx(20) },
  { name: 'lh-lg', value: transToPx(28) },
  { name: 'fz-xl', value: transToPx(24) },
  { name: 'lh-xl', value: transToPx(32) },
  { name: 'fz-xxl', value: transToPx(30) },
  { name: 'lh-xxl', value: transToPx(38) },
  { name: 'fz-xxxl', value: transToPx(38) },
  { name: 'lh-xxxl', value: transToPx(46) },
  { name: 'fz-title', value: transToPx(16) },
  { name: 'lh-title', value: transToPx(24) },
  { name: 'fw-lr', value: 'lighter' },
  { name: 'fw-n', value: 'normal' },
  { name: 'fw-b', value: 'bold' },
  { name: 'fw-br', value: 'bolder' },
  { name: 'black-title', value: 'rgba(0, 0, 0, 0.85)' },
  { name: 'black-primary', value: 'rgba(0, 0, 0, 0.65)' },
  { name: 'black-secondary', value: 'rgba(0, 0, 0, 0.45)' },
  { name: 'black-disable', value: 'rgba(0, 0, 0, 0.25)' },
  { name: 'white-title', value: 'rgba(255, 255, 255, 1)' },
  { name: 'white-primary', value: 'rgba(255, 255, 255, 0.85)' },
  { name: 'white-secondary', value: 'rgba(255, 255, 255, 0.65)' },
  { name: 'white-disable', value: 'rgba(255, 255, 255, 0.45)' },
];

function transToPx(basis, step = 0) {
  return `${basis + step}px`;
}

exports.standards = standards;
