import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { CartItem } from "../models/cart-item.model";

@Injectable({
    providedIn: 'root',
})
export class CartService {
    // BehaviorSubject para almacenar y emitir el estado del carrito
    private item$ = new BehaviorSubject<CartItem[]>([]);

    // Devuelve un Observable que emite el estado actual del carrito
    getCart() {
        return this.item$.asObservable();
    }

    // Agrega un nuevo elemento al carrito
    addToCart(newItem: CartItem) {
        this.item$.next([...this.item$.getValue(), newItem]);
    }

    // Elimina un elemento del carrito por su ID
    removeItem(id: number) {
        this.item$.next(this.item$.getValue().filter((item) => +item.id !== id));
    }

    // Cambia la cantidad de un elemento en el carrito
    changeQty(quantity: number, id: number) {
        const items = this.item$.getValue();
        const index = items.findIndex((item) => parseInt(item.id, 10) === id);
        items[index].quantity += quantity;
        this.item$.next(items);
    }

    // Calcula el monto total de todos los elementos en el carrito
    getTotalAmount() {
        return this.item$.pipe(
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
