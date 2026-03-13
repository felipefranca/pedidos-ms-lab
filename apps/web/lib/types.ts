export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: string;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type OrderStatus = "CREATED" | "PAID" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type Order = {
  id: number;
  customerId: number;
  customerName: string;
  itemName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
};
