export function sArrowUp(width = '5px', color = 'black') {
  return {
    width: 0,
    height: 0,
    borderLeft: `${width} solid transparent`,
    borderRight: `${width} solid transparent`,
    borderBottom: `${width} solid ${color}`,
  };
}

export function sArrowDown(width = '5px', color = 'black') {
  return {
    width: 0,
    height: 0,
    borderLeft: `${width} solid transparent`,
    borderRight: `${width} solid transparent`,
    borderTop: `${width} solid ${color}`,
  };
}

export function sArrowRight(width = '5px', color = 'black') {
  return {
    width: 0,
    height: 0,
    borderTop: `${width} solid transparent`,
    borderBottom: `${width} solid transparent`,
    borderLeft: `${width} solid ${color}`,
  };
}

export function sArrowLeft(width = '5px', color = 'black') {
  return {
    width: 0,
    height: 0,
    borderTop: `${width} solid transparent`,
    borderBottom: `${width} solid transparent`,
    borderRight: `${width} solid ${color}`,
  };
}
