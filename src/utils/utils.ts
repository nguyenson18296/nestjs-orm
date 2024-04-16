export const isEmpty = (val: any): boolean =>
  val == null || !(Object.keys(val) || val).length;

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};

export const generateSlug = (inputString: string): string => {
  return inputString
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters except hyphens
    .replace(/^-+|-+$/g, '')
    .trim(); // Trim hyphens from start and end
};
