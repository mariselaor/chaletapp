import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CartItem } from "../models/cart-item.model";
import { FoodItem } from "../models/food.model";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);

  getCart(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  addToCart(newItem: CartItem): void {
    const currentItems = this.items$.getValue();
    this.items$.next([...currentItems, newItem]);
  }

  addFoodToCart(foodItem: FoodItem): void {
    const currentItems = this.items$.getValue();
    const itemIndex = currentItems.findIndex(item => item.id === foodItem.id);
    if (itemIndex !== -1) {
      currentItems[itemIndex].quantity += 1;
    } else {
      const newCartItem: CartItem = {
        id: foodItem.id,
        name: foodItem.title,
        price: foodItem.price,
        quantity: 1,
        image: foodItem.image, // Agrega la propiedad image al nuevo CartItem
      };
      currentItems.push(newCartItem);
    }
    this.items$.next([...currentItems]);
  }

  deleteFood(foodId: string): void {
    const items = this.items$.getValue();
    const updatedItems = items.filter(item => item.id !== foodId);
    this.items$.next(updatedItems);
  }

  changeQty(quantity: number, id: string): void {
    const items = this.items$.getValue();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].quantity += quantity;
      if (items[index].quantity <= 0) {
        this.deleteFood(id);
      } else {
        this.items$.next([...items]);
      }
    }
  }

  getTotalAmount(): Observable<number> {
    return this.items$.pipe(
      map((items) => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
      })
    );
  }
}
