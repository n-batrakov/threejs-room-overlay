export const fold = (nested: any, separator = '.'): any => {
  if (!nested || typeof nested !== 'object') return undefined;
  return Object.entries(nested).reduce(
    (acc, [k, v]) => {
      if (v instanceof Date || typeof v !== 'object' || Array.isArray(v)) {
        acc[k] = v;
        return acc;
      }

      Object.entries(fold(v, separator)).forEach(([k1, v1]) => {
        acc[`${k}${separator}${k1}`] = v1;
      });

      return acc;
    },
    {} as any
  );
};

export const unfold = (plain: any, separator = '.') => {
  if (!plain || typeof plain !== 'object') return undefined;

  let nested: any = {};

  Object.entries(plain).forEach(([k, v]) => {
    let parent = nested;
    let keys = k.split(separator);

    keys.forEach((key, i) => parent = parent[key] =
      i === keys.length - 1
        ? v
        : parent[key] || {},
    );
  });

  return nested;
};
