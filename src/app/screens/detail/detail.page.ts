import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Agregamos Router
import { ToastController } from '@ionic/angular';
import { CartItem } from 'src/app/models/cart-item.model';
import { FoodItem } from 'src/app/models/food.model';
import { FoodService } from 'src/app/services/food.service';
import { CartService } from 'src/app/services/cart.service';

import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  id: number | null = null;
  food: FoodItem = {
    id: '',
    categoryId: '', // Asegúrate de proporcionar un valor apropiado para categoryId
    title: '',
    price: null,
    image: '',
    description: '',
    selected: false
  };
  user: User | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private router: Router, 
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getUser();
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
      this.foodService.getFood(idParam).subscribe((food: FoodItem) => {
        this.food = food;
      });
    }
  }

  getUser() {
    this.firebaseService.getCurrentUser().subscribe(
      (userData) => {
        this.user = userData;
      }
    );
  }

  async addItemToCart() {
    if (this.food && this.food.id !== null) {
      const cartItem: CartItem = {
        id: this.food.id.toString(),
        name: this.food.title,
        price: this.food.price,
        image: this.food.image || '',
        quantity: 1,
      };

      // Aquí llamamos al método para agregar al carrito en el servicio adecuado.
      this.cartService.addToCart(cartItem);

      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Food added to the cart',
      position: 'top',
      duration: 2000,
    });

    toast.present();
  }

  // Método deleteFood modificado para trabajar con string
  async deleteFood() {
    if (this.food && this.food.id !== null) {
      const foodId = this.food.id;
      this.firebaseService.deleteFoodFromFirestore(foodId).then(() => {
        this.router.navigate(['/home/listing']);
      })
    }
  }
}
