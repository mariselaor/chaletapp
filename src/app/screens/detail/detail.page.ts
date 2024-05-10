import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Agregamos Router
import { ToastController } from '@ionic/angular';
import { CartItem } from 'src/app/models/cart-item.model';
import { Food } from 'src/app/models/food.model';
import { FoodService } from 'src/app/services/food.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  id: number | null = null;
  food: Food = {
    id: '',
    categoryId: '', // Asegúrate de proporcionar un valor apropiado para categoryId
    title: '',
    price: null,
    image: '',
    description: ''
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private router: Router, // Inyectamos Router
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
      this.foodService.getFood(idParam).subscribe((food: Food) => {
        this.food = food;
      });
    } else {
      // Manejar el caso en que no se proporciona ningún ID en la URL
    }
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

      //Aquí llamamos al método para agregar al carrito en el servicio adecuado.
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

  // En DetailPage
  async deleteFood() {
    if (this.food && this.food.id !== null) {
      // Convertir el ID de cadena a número antes de pasar al método deleteFood
      const foodId = parseInt(this.food.id);
      this.cartService.deleteFood(foodId);
      console.log('Eliminar comida con ID:', foodId);
    }
  }
  

}
