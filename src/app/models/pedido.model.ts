import { CartItem } from './cart-item.model';

export interface Pedido {
  id: string; // Agrega la propiedad id
  nombreCliente: string;
  fecha: any; // Firestore Timestamp
  totalAmount: number;
  estado: string;
  items: CartItem[];
}
