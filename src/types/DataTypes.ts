export interface TableHeader {
  label: string;
  key: string;
  sortable?: boolean;
}

export interface DateRangeDTO {
  start: string;
  end: string;
}

export interface SortParamsDTO {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PageLink {
  tab: string;
  routeTo: {
    name: string;
    query: {
      [key: string]: string;
    };
  };
}

export interface PaginationRequestDTO {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ErrorMessage {
  name?: string;
  message?: string;
}

export interface PageAndSearchFilterDTO {
  pageSize: number;
  pageNumber: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchKeyword?: string;
}

export interface KeyValue {
  [key: string]: string;
}
