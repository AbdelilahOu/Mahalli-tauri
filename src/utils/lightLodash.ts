type groupBy = <T>(list: Record<any, any>[], by: string) => Record<string, T[]>;

export const groupBy: groupBy = (list, by) => {
  if (typeof list !== "object" || !("length" in list)) return {};

  let result = new Map<string, any[]>();

  for (const el of list) {
    if (by in el) {
      let current = result.get(el[by]);
      if (!current) {
        result.set(el[by], [el]);
        continue;
      }
      result.set(el[by], [...current, el]);
    }
  }

  return Object.fromEntries(result);
};

type keys = (obj: Record<any, any>) => string[];

export const keys: keys = (obj) => {
  if (typeof obj !== "object") return [];

  let result = new Set<string>();

  for (const [key] of Object.entries(obj)) {
    result.add(key);
  }

  return Array.from(result);
};

type values = (obj: Record<any, any>) => any[];

export const values: values = (obj) => {
  if (typeof obj !== "object") return [];

  let result = [];

  for (const [_, value] of Object.entries(obj)) {
    result.push(value);
  }

  return result;
};

type mapValues = (obj: Record<any, any>, cb: Function) => Record<any, any>;

export const mapValues: mapValues = (obj, callback) => {
  if (typeof obj !== "object") return {};

  let result = new Map<string, any>();

  for (const [key, value] of Object.entries(obj)) {
    result.set(key, callback(value));
  }

  return Object.fromEntries(result);
};
