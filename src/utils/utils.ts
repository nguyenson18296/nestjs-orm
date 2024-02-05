export const isEmpty = (val: any): boolean =>
  val == null || !(Object.keys(val) || val).length;
