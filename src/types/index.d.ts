export type Res<T> = {
  error?: string;
  message?: string;
  data: T;
};

export type DataRecord = {
  x: number;
  y: number;
};
