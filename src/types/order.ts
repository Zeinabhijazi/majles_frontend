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

  orderDate: string;
  userType: string;
  longitude?: string;
  latitude?: string;
  addressOne?: string;
  addressTwo?: string;
  postNumber?: string;
  country?: string;
  city: string;
  isDeleted: boolean;
  isAccepted: boolean;
}