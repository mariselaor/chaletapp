import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item.model';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { FoodItem } from 'src/app/models/food.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/models/pedido.model';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems$: Observable<CartItem[]> | null = null;
  totalAmount$: Observable<number> | null = null;
  foods$: Observable<FoodItem[]> | null = null;
  user: any; // Almacenará la información del usuario autenticado

  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private alertCtrl: AlertController,
    private pedidoService: PedidoService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore // Inyectamos AngularFirestore aquí
  ) { }

  ngOnInit() {
    this.cartItems$ = this.cartService.getCart();
    this.totalAmount$ = this.cartService.getTotalAmount();

    this.cartItems$.subscribe(items => this.cartItems = items);
    this.totalAmount$.subscribe(amount => this.totalAmount = amount);
    this.foods$ = this.foodService.getFoodsItems();

    // Obtener el usuario autenticado al inicializar el componente
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.getUserData(user.uid); // Obtener datos del usuario si está autenticado
      } else {
        this.user = null; // Si no hay usuario autenticado, establecer como null
      }
    });
  }

  // Método para obtener los datos del usuario desde Firestore
  getUserData(uid: string) {
    this.firestore.doc<any>(`users/${uid}`).valueChanges().subscribe(userData => {
      this.user = userData; // Asignar los datos del usuario al objeto user
    });
  }

  async onIncrease(item: CartItem) {
    this.cartService.changeQty(1, item.id);
  }

  async onDecrease(item: CartItem) {
    if (item.quantity == 1) this.removeFromCart(item);
    else this.cartService.changeQty(-1, item.id);
  }

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

  generatePdf() {
    this.pedidoService.generatePdf(this.cartItems, this.totalAmount);
  }

  addToCart(foodItem: FoodItem) {
    this.cartService.addFoodToCart(foodItem);
  }

  async confirmOrder() {
    if (!this.user) {
      console.error('Usuario no autenticado. No se puede registrar el pedido.');
      return;
    }

    await this.presentConfirmOrderAlert();
  }

  async presentConfirmOrderAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Pedido',
      message: '¿Está seguro de que desea confirmar su pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirmación de pedido cancelada.');
          },
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.registerOrder();
          },
        },
      ],
    });

    await alert.present();
  }

  registerOrder(): void {
    if (!this.user) {
      console.error('Usuario no autenticado. No se puede registrar el pedido.');
      return;
    }

    const orderDetails: Pedido = {
      nombreCliente: this.user.name || 'Cliente Anónimo',
      fecha: firebase.firestore.Timestamp.now(),
      totalAmount: this.totalAmount,
      estado: 'pendiente',
      items: this.cartItems,
      id: '' // Agrega la propiedad id
    };

    this.pedidoService.registerOrder(orderDetails)
      .then(() => {
        console.log('Pedido registrado exitosamente.');
        this.cartService.clearCart();
        this.generatePdf(); 
      })
      .catch(error => {
        console.error('Error al registrar el pedido:', error);
      });
  }  
}
