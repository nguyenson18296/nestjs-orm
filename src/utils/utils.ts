export const isEmpty = (val: any): boolean =>
  val == null || !(Object.keys(val) || val).length;

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};
