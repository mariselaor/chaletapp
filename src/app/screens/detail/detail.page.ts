import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class DetailPage implements OnInit {
  id: number | null = null;
  food: Food | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private foodService: FoodService, 
    private cartService: CartService, // Inyecta el servicio CartService
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
    if (this.food !== undefined) {
      const cartItem: CartItem = {
        id: this.food.id?.toString() || '', // Usa optional chaining para evitar errores si this.food.id es undefined
        name: this.food.title,
        price: this.food.price,
        image: this.food.image || '',
        quantity: 1,
      };
  
      //Aquí debes llamar al método para agregar al carrito en el servicio adecuado.
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
}
