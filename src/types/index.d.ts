export interface RouteLinksTypeT {
  path: string;
  name: string;
  component: string;
  display: boolean;
}

export type Res<T> = {
  error?: string;
  message?: string;
  data: T;
};
