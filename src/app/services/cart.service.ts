import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { CartItem } from "../models/cart-item.model";

@Injectable({
    providedIn: 'root',
})
export class CartService {
    // BehaviorSubject para almacenar y emitir el estado del carrito
    private items$ = new BehaviorSubject<CartItem[]>([]);

    // Devuelve un Observable que emite el estado actual del carrito
    getCart(): Observable<CartItem[]> {
        return this.items$.asObservable();
    }

    // Agrega un nuevo elemento al carrito
    addToCart(newItem: CartItem): void {
        const currentItems = this.items$.getValue();
        this.items$.next([...currentItems, newItem]);
    }

    // Elimina un elemento del carrito por su ID
    deleteFood(foodId: number): void {
        const items = this.items$.getValue();
        const updatedItems = items.filter(item => item.id !== foodId.toString());
        this.items$.next(updatedItems);
    }

    // Cambia la cantidad de un elemento en el carrito
    changeQty(quantity: number, id: number): void {
        const items = this.items$.getValue();
        const index = items.findIndex(item => item.id === id.toString());
        if (index !== -1) {
            items[index].quantity += quantity;
            this.items$.next(items);
        }
    }

    // Calcula el monto total de todos los elementos en el carrito
    getTotalAmount(): Observable<number> {
        return this.items$.pipe(
            map((items) => {
                let total = 0;
                items.forEach((item) => {
                    total += item.quantity * item.price;
                });
                return total;
            })
        );
    }
}
