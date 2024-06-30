export type Res<T> = {
  error?: string;
  message?: string;
  data: T;
};

export type QueryParams = {
  search: string;
  page: number;
  refresh: string;
  date?: string;
  status?: string;
  limit: number;
  created_at?: string;
};
