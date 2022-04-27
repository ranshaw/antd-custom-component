const standards = [
  { name: 'space-mini', value: transToPx(4) },
  { name: 'space-xs', value: transToPx(8) },
  { name: 'space-sm', value: transToPx(16) },
  { name: 'space-base', value: transToPx(24) },
  { name: 'space-md', value: transToPx(32) },
  { name: 'space-lg', value: transToPx(40) },
  { name: 'space-xl', value: transToPx(48) },
  { name: 'space-xxl', value: transToPx(56) },
  { name: 'space-xxxl', value: transToPx(64) },
];

function transToPx(basis, step = 0) {
  return `${basis + step}px`;
}

exports.standards = standards;
