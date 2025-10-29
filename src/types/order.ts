export interface Order {
  id: number;
  clientId: number;
  readerId?: number | null;
  client: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  reader?: {
    firstName: string;
    lastName: string;
  } | null;
  orderDate: Date;
  userType: string;
  longitude?: number;
  latitude?: number;
  addressOne?: string;
  addressTwo?: string;
  postNumber?: number;
  country?: string;
  city: string;
  status: string;
}
