import { CartItem } from "./product";

export interface SavedEstimate {
  id: string;
  customerName: string;
  dateISO: string;
  items: CartItem[];
  totalAmount: number;
}


