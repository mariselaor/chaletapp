import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems$: Observable<CartItem[]> | null = null; // Inicializamos con null
  totalAmount$: Observable<number> | null = null; // Inicializamos con null

  constructor(private cartService: CartService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.cartItems$ = this.cartService.getCart(); // Asignamos el valor en el ngOnInit
    this.totalAmount$ = this.cartService.getTotalAmount();
  }

  onIncrease(item:CartItem ){
    this.cartService.changeQty(1, parseInt(item.id, 10));

  }

  onDecrease(item:CartItem ){
    if (item.quantity ==1) this.removeFromCart(item);
    else this.cartService.changeQty(-1, parseInt(item.id, 10));

  }

  async removeFromCart(item: CartItem){
    const alert = await this.alertCtrl.create({
      header:  'Eliminar del carrito',
      message: '¿Está seguro de que desea eliminar?',
      buttons: [
        {
          text: 'Si',
          handler: () => this.cartService.deleteFood(parseInt(item.id)),
        },
        {
          text :'No',
        },
      ],
    });

    alert.present();
    
  }
}
