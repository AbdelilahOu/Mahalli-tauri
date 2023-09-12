type groupBy = <T>(list: Record<any, any>[], by: string) => Record<string, T[]>;

export const groupBy: groupBy = (list, by) => {
  let result = new Map<string, any[]>();

  if (list.length) return {};

  for (const el of list) {
    if (by in el) {
      let current = result.get(el[by]);
      if (!current) {
        result.set(el[by], [el]);
        continue;
      } else {
        result.set(el[by], [...current, el]);
      }
    }
  }

  return Object.fromEntries(result);
};

type keys = (obj: Record<any, any>) => string[];

export const keys: keys = (obj) => {
  let result = new Set<string>();

  for (const [key] of Object.entries(obj)) {
    result.add(key);
  }

  return Array.from(result);
};

type values = (obj: Record<any, any>) => any[];

export const values: values = (obj) => {
  let result = new Set<any>();

  for (const [_, value] of Object.entries(obj)) {
    result.add(value);
  }

  return Array.from(result);
};

type mapValues = (obj: Record<any, any>, cb: Function) => Record<any, any>;

export const mapValues: mapValues = (obj, callback) => {
  let result = new Map<string, any>();

  for (const [key, value] of Object.entries(obj)) {
    result.set(key, callback(value));
  }

  return Object.fromEntries(result);
};
