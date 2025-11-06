export interface PaginationDto<T> {
  content: T[];
  itemsCount: number;
  pageCount: number;
  itemsCountWithDel: number;
  pendingItemsCount: number;
  completedItemsCount: number;
  acceptedItemsCount: number;
  rejectedItemsCount: number;
}
