import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CartItem } from "../models/cart-item.model";
import { FoodItem } from "../models/food.model";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // BehaviorSubject para mantener el estado del carrito de compras
  private items$ = new BehaviorSubject<CartItem[]>([]);

  // Obtener el carrito como un observable
  getCart(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  // Agregar un nuevo ítem al carrito
  addToCart(newItem: CartItem): void {
    const currentItems = this.items$.getValue(); // Obtener los ítems actuales
    this.items$.next([...currentItems, newItem]); // Agregar el nuevo ítem al carrito
  }

  // Agregar un alimento al carrito
  addFoodToCart(foodItem: FoodItem): void {
    const currentItems = this.items$.getValue(); // Obtener los ítems actuales
    const itemIndex = currentItems.findIndex(item => item.id === foodItem.id); // Buscar si el ítem ya está en el carrito
    if (itemIndex !== -1) {
      // Si el ítem ya está en el carrito, incrementar la cantidad
      currentItems[itemIndex].quantity += 1;
    } else {
      // Si el ítem no está en el carrito, agregarlo como un nuevo CartItem
      const newCartItem: CartItem = {
        id: foodItem.id,
        name: foodItem.title,
        price: foodItem.price,
        quantity: 1,
        image: foodItem.image, 
      };
      currentItems.push(newCartItem);
    }
    this.items$.next([...currentItems]); // Actualizar el carrito
  }

  // Eliminar un ítem del carrito por su id
  deleteFood(foodId: string): void {
    const items = this.items$.getValue(); // Obtener los ítems actuales
    const updatedItems = items.filter(item => item.id !== foodId); // Filtrar el ítem a eliminar
    this.items$.next(updatedItems); // Actualizar el carrito
  }

  // Cambiar la cantidad de un ítem en el carrito
  changeQty(quantity: number, id: string): void {
    const items = this.items$.getValue(); // Obtener los ítems actuales
    const index = items.findIndex(item => item.id === id); // Buscar el ítem por su id
    if (index !== -1) {
      items[index].quantity += quantity; // Cambiar la cantidad
      if (items[index].quantity <= 0) {
        this.deleteFood(id); // Si la cantidad es menor o igual a 0, eliminar el ítem del carrito
      } else {
        this.items$.next([...items]); // Actualizar el carrito
      }
    }
  }

  // Obtener el monto total del carrito como un observable
  getTotalAmount(): Observable<number> {
    return this.items$.pipe(
      map((items) => {
        // Calcular el total multiplicando la cantidad por el precio de cada ítem
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
      })
    );
  }
}