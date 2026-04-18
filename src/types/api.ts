export interface PaginationMeta {
  /** Página atual (1-based), alinhado à API NestJS */
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
