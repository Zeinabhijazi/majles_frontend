// types/OrderForEdit.ts
export interface OrderForEdit {
  orderDate?: Date;
  longitude?: number;
  latitude?: number;
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  country?: string;
  postNumber?: number;
  readerId?: number;
}