import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Food } from 'src/app/models/food.model';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  newFood: Food = {
    id: '', // Asigna un valor adecuado al ID si lo necesitas
    title: '',
    price: null,
    description: '',
    categoryId: '',
    image: '' // Agrega la propiedad 'image' al objeto newFood
  };
  

  categories: Category[] = [];
  categoriesSubscription: Subscription;

  constructor(private modalController: ModalController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesSubscription = this.firebaseService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  async addFood() {
    try {
      // Genera un nuevo ID único para el producto
      const newProductId = uuidv4();
  
      // Asigna el nuevo ID al objeto newFood
      this.newFood.id = newProductId;
  
      // Agrega la lógica para agregar el producto a la base de datos
      await this.firebaseService.addFood(this.newFood);
      console.log('Producto agregado exitosamente');
      this.modalController.dismiss();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  }
  
  closeModal() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
