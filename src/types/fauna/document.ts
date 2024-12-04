export interface FaunaDocument<T> {
  ref: { id: string };
  data: T;
  ts?: number;
}

export interface FaunaResponse<T> {
  data: Array<FaunaDocument<T>> | FaunaDocument<T>;
}

export interface QueryResult<T> {
  data: T[];
  after?: string | null;
  before?: string | null;
}