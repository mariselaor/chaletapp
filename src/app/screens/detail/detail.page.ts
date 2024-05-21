import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CartItem } from 'src/app/models/cart-item.model';
import { Food } from 'src/app/models/food.model';
import { FoodService } from 'src/app/services/food.service';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: number | null = null;
  food: Food = {
    id: '',
    categoryId: '',
    title: '',
    price: null,
    image: '',
    description: ''
  };
  user: User | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getUser();
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
      this.foodService.getFood(idParam).subscribe((food: Food) => {
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

  async deleteFood() {
    if (this.food && this.food.id !== null) {
      const foodId = this.food.id;
      this.firebaseService.deleteFoodFromFirestore(foodId).then(() => {
        this.router.navigate(['/listing']);
      })
    }
  }
}
