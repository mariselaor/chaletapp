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

  ngOnInit() {
    this.cartItems$ = this.cartService.getCart();
    this.totalAmount$ = this.cartService.getTotalAmount();

    this.cartItems$.subscribe(items => this.cartItems = items);
    this.totalAmount$.subscribe(amount => this.totalAmount = amount);

    this.foods$ = this.foodService.getFoodsItems();
  }

  onIncrease(item: CartItem) {
    this.cartService.changeQty(1, item.id); // Eliminamos parseInt
  }

  onDecrease(item: CartItem) {
    if (item.quantity == 1) this.removeFromCart(item);
    else this.cartService.changeQty(-1, item.id); // Eliminamos parseInt
  }

  async removeFromCart(item: CartItem) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar del carrito',
      message: '¿Está seguro de que desea eliminar?',
      buttons: [
        {
          text: 'Si',
          handler: () => this.cartService.deleteFood(item.id), // Eliminamos parseInt
        },
        {
          text: 'No',
        },
      ],
    });

    alert.present();
  }

  generatePdf() {
    this.firestore.generatePdf(this.cartItems, this.totalAmount);
  }

  addToCart(foodItem: FoodItem) {
    this.cartService.addFoodToCart(foodItem);
  }
}