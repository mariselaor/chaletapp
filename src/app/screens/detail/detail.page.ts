import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    categoryId: '',
    title: '',
    price: null,
    image: '',
    description: '',
    selected: false
  };
  user: User | null = null;
  selectedFile: File | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController
  ) { }

   // Método ngOnInit que se ejecuta al inicializar el componente
   ngOnInit() {
    this.getUser(); // Obtener la información del usuario
    const idParam = this.activatedRoute.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    if (idParam !== null) {
      this.id = +idParam; // Asigna el ID a la variable local
      this.foodService.getFood(idParam).subscribe((food: FoodItem) => {
        this.food = food; // Asigna los datos del alimento al objeto local
      });
    }
  }

  // Método para obtener la información del usuario actual
  getUser() {
    this.firebaseService.getCurrentUser().subscribe(
      (userData) => {
        this.user = userData;
      }
    );
  }

  // Método para manejar la selección de un archivo
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.food.image = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Método para agregar un alimento al carrito
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

  // Método para mostrar una notificación tipo toast
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Agregado al carrito',
      position: 'top',
      duration: 2000,
      color: 'success'
    });

    toast.present();
  }

  // Método para eliminar un alimento
  async deleteFood() {
    if (this.food && this.food.id !== null) {
      const foodId = this.food.id;
      this.firebaseService.deleteFoodFromFirestore(foodId).then(() => {
        this.router.navigate(['/home/listing']);
      });
    }
  }

  // Método para navegar a la página de edición de un alimento
  editFood() {
    if (this.food && this.food.id !== null) {
      this.router.navigate(['/edit', this.food.id]);
    }
  }
}