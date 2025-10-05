export interface ApiResponse<T> {
  data: T;       
  success: boolean;
  total?: number;  
}