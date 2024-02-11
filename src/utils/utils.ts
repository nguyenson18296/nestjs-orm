export const isEmpty = (val: any): boolean =>
  val == null || !(Object.keys(val) || val).length;

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && isFinite(value);
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim(); // Trim hyphens at the start and end of the slug
};
