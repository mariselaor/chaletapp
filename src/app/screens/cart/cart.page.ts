import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item.model';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems$: Observable<CartItem[]> | null = null;
  totalAmount$: Observable<number> | null = null;
  foods$: Observable<FoodItem[]> | null = null;

  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private alertCtrl: AlertController,
    private firestore: FirebaseService,
  ) {}

 // Método ngOnInit que se ejecuta al inicializar el componente
 ngOnInit() {
  this.cartItems$ = this.cartService.getCart(); // Obtiene los items del carrito
  this.totalAmount$ = this.cartService.getTotalAmount(); // Obtiene el monto total

  // Suscribe a los observables para actualizar los items del carrito y el monto total
  this.cartItems$.subscribe(items => this.cartItems = items);
  this.totalAmount$.subscribe(amount => this.totalAmount = amount);

  // Obtiene los alimentos desde el servicio de alimentos
  this.foods$ = this.foodService.getFoodsItems();
}

// Método para aumentar la cantidad de un item en el carrito
onIncrease(item: CartItem) {
  this.cartService.changeQty(1, item.id);
}

// Método para disminuir la cantidad de un item en el carrito
onDecrease(item: CartItem) {
  if (item.quantity == 1) this.removeFromCart(item);
  else this.cartService.changeQty(-1, item.id); 
}

// Método para eliminar un item del carrito con confirmación de alerta
async removeFromCart(item: CartItem) {
  const alert = await this.alertCtrl.create({
    header: 'Eliminar del carrito',
    message: '¿Está seguro de que desea eliminar?',
    buttons: [
      {
        text: 'Si',
        handler: () => this.cartService.deleteFood(item.id), 
      },
      {
        text: 'No',
      },
    ],
  });

  alert.present();
}

// Método para generar un PDF del carrito de compras
generatePdf() {
  this.firestore.generatePdf(this.cartItems, this.totalAmount);
}

// Método para agregar un alimento al carrito
addToCart(foodItem: FoodItem) {
  this.cartService.addFoodToCart(foodItem);
}
}