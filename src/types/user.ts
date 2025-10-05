export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  userType: string;
  email: string;
  phoneNumber: string;
  longitude: number;
  latitude: number;
  addressOne: string;
  addressTwo?: string;
  postNumber: number;
  country: string;
  city: string;
  isDeleted: boolean;
}