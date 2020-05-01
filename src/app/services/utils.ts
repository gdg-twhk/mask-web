import { environment } from '../../environments/environment';

export function determineLevel(currenStoage, type: 'adult' | 'child') {
  const baseNum =
    type === 'adult' ? environment.adultStorage : environment.childStorage;
  const ratio = (currenStoage / baseNum) * 100;
  return ratio >= 50
    ? 'safe'
    : ratio >= 20
    ? 'warning'
    : ratio > 0
    ? 'low'
    : 'soldout';
}

export function getMarkerImage(level) {
  return {
    safe: 'marker_green.png',
    warning: 'marker_yellow.png',
    low: 'marker_red.png',
    soldout: 'marker_grey.png'
  }[level];
}

export function getlevelSize(level) {
  return {
    safe: 60,
    warning: 60,
    low: 50,
    soldout: 50
  }[level];
}

export const maskSortRule = maskOption => (a, b) => {
  return maskOption === 1
    ? a.maskAdult > b.maskAdult
      ? -1
      : 1
    : a.maskChild > b.maskChild
    ? -1
    : 1;
};

export const filterDataRule = filter => value => {
  return filter.length > 0
    ? [
        value.name.includes(filter),
        value.address.includes(filter),
        value.phone.includes(filter)
      ].some(r => r)
    : true;
};
