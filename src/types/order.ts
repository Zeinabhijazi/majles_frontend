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
  longitude?: string;
  latitude?: string;
  addressOne?: string;
  addressTwo?: string;
  postNumber?: number;
  country?: string;
  city: string;
  isDeleted: boolean;
  isAccepted: boolean;
  isCompleted?: boolean; 
}
