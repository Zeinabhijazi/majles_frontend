export interface PaginationDto<T> {
  content: T[];
  itemsCount: number;
  pageCount: number;
}
